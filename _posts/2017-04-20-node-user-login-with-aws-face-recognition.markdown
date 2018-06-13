---
layout: post
title:  "Node User Login With AWS’ Face Recognition"
head: '<meta name="theme-color" content="#24272E">'
style: "
body, header .nav {
  background-color: #24272E;
}
*,a, input {
  color: white;
}
.highlighter-rouge {
  color: white;
  background-color: #353b45;
}
#hamburger-icon .line {
  background: white;
}
"
---

So the other day I wanted to make a Node app just for practice, and I thought wouldn’t be cool if there’s a dead simple app that stores your secrets and can only be accessed by you? it should be absolutely seamless, like talking to a confidant, once it sees who you are it knows what to show.
<!--more-->
The app we will be building is a note taking app. There are no ‘accounts’, each time you start the the app it asks you to authenticate with your face, if it is your first time you’ll have a blank page where you can add notes, else if you already have notes previously added you’ll be able to see/edit them.

To see the end result click [here][Secretly].

For the face recognition, I will use Amazon Rekognition, which is their deep learning-based image recognition API. I would also like to add that this idea is a complete disaster when it comes to security, since anyone with a picture of the user can access their notes 🤣, maybe it can be used as a second factor for authentication.

Anyway, let’s get to it.

---

## First, Getting That Sexy Image

Here we bump into the limitations of the web since not all browsers support accessing the device's camera using `navigator.getUserMedia` (looking at you Safari), we will have to fall back to `<input type="file">`.

If the browser supports `navigator.getUserMedia` we will:
1. Access the camera and get a video stream using getUserMedia.
1. Play the stream on a video element.
1. When the user takes the picture, we draw the current frame on a canvas element.
1. Transform the canvas into an image dataURL then send it to the server.

Else:
1. Display an input of type file
2. When the user submits the input, upload the file to the server.

The HTML markup will look like this:

```html
<!-- Supports getUserMedia -->
<button id="take-photo" type="button" name="take-photo">
  Take Picture
</button>
<div class="camera-container">
  <video id="camera-stream"></video>
  <img id="snap">
  <canvas></canvas>
</div>

<!-- Does Not Support getUserMedia -->
<form method="post"enctype="multipart/form-data" action="/auth">
  <label for="auth-pic">Authenticate</label>
  <input
    id="auth-pic"
    type="file"
    style="display:none;"
    name="file"
    onchange="this.form.submit();"
  >
</form>
```

And the JS for accessing the camera will look like this:

```js
if(!navigator.getUserMedia){
  // When not supported, switch to 'input type file'
  switchImageInput();
} else {
  // Request the camera.
  navigator.getMedia({video: true},
    // Success Callback
    function(stream){
      // Create an object URL for the video stream and
      // set it as src of our HTLM video element.
      video.src = window.URL.createObjectURL(stream);
      video.play();
      video.onplay = function() {
        showVideo();
      };
    },
    // Error Callback
    function(err){
      switchImageInput();
    }
  );
}
```


Now that we have a video stream, we will make a function that takes a snapshot of the video.

```js
function takeSnapshot(){
  var hidden_canvas = document.querySelector('canvas'),
      context = hidden_canvas.getContext('2d');
  var width = video.videoWidth,
      height = video.videoHeight;
  if (width && height) {
    hidden_canvas.width = width;
    hidden_canvas.height = height;
    context.drawImage(video, 0, 0, width, height);
    return hidden_canvas.toDataURL('image/jpeg');
  }
}
```

Now we tie the function to our button, and send the image to the server.

```js
take_photo_btn.addEventListener("click", function(event){
  event.preventDefault();
  var snap = takeSnapshot();
  sendImageToServer(snap);
  // Show image.
  image.setAttribute('src', snap);
  image.classList.add("visible");
  video.pause();
});

function sendImageToServer(imageData) {
  var method = 'post';
  var path = '/auth';
  var data = JSON.stringify({image: imageData});

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  var hiddenField = document.createElement("input");
  hiddenField.setAttribute("type", "hidden");
  hiddenField.setAttribute("name", "image");
  hiddenField.setAttribute("value", imageData);

  form.appendChild(hiddenField);

  document.body.appendChild(form);
  form.submit();
};
```

You can see the full [HTML][login.ejs], [CSS][login.css] and [JS][login.js].

Now that the user POSTed their picture, we'll need to handle that POST request in Node. I'm using `express` with `multer` to handle the file uploading from the form input.

```js
const express = require('express');
const multer  = require('multer');
const bodyParser = require('body-parser');

const authController = require('./controllers/auth');

const app = express();

const upload = multer({
  dest: 'uploads/',
  fileFilter: function(req, file, cb) {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: File upload only supports the following filetypes - " + filetypes);
  }
});

app.use(bodyParser.urlencoded({limit: '5mb'}));

app.post('/auth', upload.single('file'), authController.index);
```

Our authController:
```js
const path = require('path');
const sharp = require('sharp');
const appDir = path.dirname(require.main.filename);

/**
 * POST /auth
 * Authentication Page.
 */

exports.index = (req, res) => {
  if (req.file) {
    const fileName = appDir + '/' + req.file.path;
    // Use sharp to resize the image
    sharp(fileName).resize(null, 700).toBuffer(function (err, buf) {
      // TODO: Authenticate using the image buffer
    });
  } else {
    const imageBuffer = getBase64Buffer(req.body.image);
    // TODO: Authenticate using the image buffer
  }
};

function getBase64Buffer(dataString) {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}
```

After getting the image buffer, we will pass it to our authentication function.

---

## Second, User Authentication

Since we are using AWS you'll need to set up an AWS account and create an administrator user, for more info click [here][AWS Account].

Then install the [AWS CLI][AWS CLI].

```bash
$ pip install --upgrade --user awscli
```

Configure it:

```bash
$ aws configure
# AWS Access Key ID: YOUR ACCESS ID
# AWS Secret Access Key:  YOUR SECRET KEY
# Default region name:  YOUR REGION
# Default output format: json
```

In order to use the Rekognition service to register our users and then look them up when trying to log in again, we'll have to store their images somehow. Thankfully that won't be necessary since AWS Rekognition offers a storage-based API, using the IndexFaces operation we can store the important facial information of our users without storing the actual image bytes.

To do this we'll first need to create a face collection, which is a container for persisting faces detected by the IndexFaces API. Using the AWS CLI provide a collection-id (string) which will use in the future to store our users' facial information.

```bash
$ aws rekognition create-collection --collection-id "YOUR-COLLECTION-ID"
```

Make sure it was successfully created:

```bash
$ aws rekognition list-collections
#{
#    "CollectionIds": [
#        "YOUR-COLLECTION-ID"
#    ]
#}
```

Here's how you delete a collection:

```bash
$ aws rekognition delete-collection --collection-id "YOUR-COLLECTION-ID"
```

Now that we have our collection we can use `indexFaces` to add faces to the collection, and use `searchFacesByImage` to search the collection for a face supplied by an image.

First we need to configure AWS in our app, add a `aws-config.json` file like this one:

```json
{
  "accessKeyId": "YOUR-ACCESS-KEY-ID",
  "secretAccessKey": "YOUR-SECRET-ACCESS-KEY",
  "region": "YOUR-REGION"
}
```

Then we'll create a `faceAuth` function that takes an image buffer and callback, which will call the callback indicating whether there's a face in the image and if there is, return the data.

```js
const AWS = require('aws-sdk');
const uuid = require('node-uuid');

AWS.config.loadFromPath(__dirname +'/aws-config.json');
const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});


exports.faceAuth = function (imageBuffer, cb) {
  var params = {
    CollectionId: 'YOUR-COLLECTION-ID',
    Image: {
      Bytes: imageBuffer
    },
    FaceMatchThreshold: 90,
    MaxFaces: 1 // We only need the face with the most resemblance
  };
  rekognition.searchFacesByImage(params, function(err, data) {
    if (data && !err) {
      // If there's a face in the image
      cb(true, data, imageBuffer);
    } else {
      // If there's no face in the image
      cb(false, {});
    }
  });
}
```

Returning to the `authControlle` we'll use our `faceAuth` function and proivde a callback:

```js
const path = require('path');
const sharp = require('sharp');
const appDir = path.dirname(require.main.filename);

/**
 * POST /auth
 * Authentication Page.
 */

exports.index = (req, res) => {
+ const authCallback = function(faceFound, data, imageBuffer) {
+   if (faceFound) {
+     if (userExsits(data).status) {
+       renderUserPage(userExsits(data).userId, res);
+     } else {
+       createUser(imageBuffer, function(userId) {
+         renderUserPage(userId, res);
+       });
+     }
+   } else {
+     res.redirect('/error-no-face-found');
+   }
+ }

  if (req.file) {
    const fileName = appDir + '/' + req.file.path;
    sharp(fileName).resize(null, 700).toBuffer(function (err, buf) {
+     faceAuth(buf, authCallback);
    });
  } else {
    const imageBuffer = getBase64Buffer(req.body.image);
+   faceAuth(imageBuffer.data, authCallback);
  }
};
```

Above I used two functions `userExsits` and `createUser`, the former checks if AWS returned a `FaceMatches` object, if it hasn't that means this a new user and we have to index him in our collection. This is where `createUser` comes in, it takes an image buffer and callback, it uses the `indexFaces` operation to index the face to our collection and create a user in our database for storing notes, which I won't be getting into here.

```js
const userExsits = function(data) {
  if (data.FaceMatches.length === 0) {
    return {
      status:false,
      userId:null
    };
  } else if (data.FaceMatches.length > 0) {
    return {
      status:true,
      userId:data.FaceMatches[0].Face.ExternalImageId
    };
  }
}

module.exports = userExsits;
```
```js
exports.createUser = function(imageBuffer, cb) {
  const newUserId = uuid.v4();

  // Add user to the database with newUserId.

  ...

  // Index the user's face with their unique ID,
  // which is the same for database

  const params = {
    CollectionId: "secretsUsers",
    DetectionAttributes: [
    ],
    ExternalImageId: newUserId,
    Image: {
     Bytes: imageBuffer
    }
   };

  rekognition.indexFaces(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      cb(newUserId);
    }
  });
}
```

Now that we the user ID we can query the database for their data and render it. I skipped the database and user data management part because it is pretty straight forward. Just create a database (firebase if you're lazy), and create a user with the same ID as the `ExternalImageId` in your Rekognition collection. When the user comes back again, request the data using the `ExternalImageId`.



[Secretly]: https://morning-island-23195.herokuapp.com
[login.ejs]: https://github.com/trufflesprouts/secretly/blob/master/views/login.ejs
[login.css]: https://github.com/trufflesprouts/secretly/blob/master/public/login.css
[login.js]: https://github.com/trufflesprouts/secretly/blob/master/public/login.js
[AWS Account]: http://docs.aws.amazon.com/rekognition/latest/dg/setting-up.html
[AWS CLI]: http://docs.aws.amazon.com/cli/latest/userguide/installing.html
