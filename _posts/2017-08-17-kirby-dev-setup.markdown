---
layout: post
title:  "The Perfect Kirby Development Setup"
excerpt: "If you plan on building websites for clients, chances are they will ask for a way to add/administer content, i.e., a content management system. Problem is, most CMSs are just plain terrible for either the developer or the client, most times they give clients either too much freedom to screw up everything (Wordpress), or they don't give enough (Siteleaf, Cloudcannon)."
head: '<meta name="theme-color" content="#e3e3dc">'
style: "
body, header .nav {
  background-color: #FFFFF8;
}
.highlighter-rouge {
  background-color: #e3e3dc;
}
"
---

If you already know what Kirby is, [click](#setup) here to skip the introduction.

If you plan on building websites for clients, chances are they will ask for a way to add/administer content, i.e., a content management system. Problem is, most CMSs are just plain terrible for either the developer or the client, most times they give clients either too much freedom to screwup everything (Wordpress), or they don't give enough (Siteleaf, Cloudcannon).

[Kirby](https://getkirby.com/) to the rescue!, it is similar to Jekyll (what I'm using for this lovely blog) in that it is a static site generator and does not require a database, it is also super developer friendly and gives you full control without making a lot of assumptions and forcing you to deal with them.

The best part about Kirby is that it takes all the developer friendliness from Jekyll and adds a simple CMS on top of it. Put it simply, it has the best CMS, you can easily give just the right amount of control to the client, its "Panel" is logical, straightforward and does not have much of a learning curve.

Learn more about Kirby [here](https://getkirby.com/).

<a name="setup"></a>
In this guide we will use Gulp to serve our Kirby site locally, use SASS, autoprefixer, uglifycss, and deploy the site to Heroku.

---

## 1. Serving Kirby Locally

In order to start developing you'll need to serve the site locally using a PHP server. Most people use MAMP (even in the docs), which I think is too big and bloaty since you won't be needing a MySQL database with Kirby.

What I use instead is `gulp-connect-php` with Gulp (obviously). This means we'll need to setup Gulp first. To setup Gulp, we'll need Node and NPM if you don't have that already download it [here](https://nodejs.org/en/).

Now that you have Node and NPM, initiate NPM in your project folder from the terminal:

```bash
$ cd path/to/project
$ npm init
```

Fill in the package details when asked, or you can just press enter since it is not really that important. Then, install Gulp globally with NPM:

```bash
$ npm install gulp-cli -g
```

And locally:

```bash
$ npm install gulp
```

Then, install `gulp-connect-php`:

```bash
$ npm install gulp-connect-php
```

Make a gulp configuration file:

```bash
$ touch gulpfile.js
```

We'll need to configure Gulp to serve PHP using `gulp-connect-php`, in `gulpfile.js`:

```js
// First, include gulp and gulp-connect-php
var gulp          = require('gulp');
    connect       = require('gulp-connect-php'),

// Second, create a task to start a PHP server
gulp.task('serve', function() {
  connect.server();
});

// Third, set the `serve` task to be the default task
gulp.task('default', ['serve']);
```

Now, in your project directory just use `gulp`, it will automatically use our default task:

```bash
$ gulp
#[00:00:00] Using gulpfile ~/path/to/project/gulpfile.js
#[00:00:00] Starting 'serve'...
#[00:00:00] Finished 'serve' after 7.82 ms
#[00:00:00] Starting 'default'...
#[00:00:00] Finished 'default' after 103 μs
#PHP 5.6.30 Development Server started at date, time
#Listening on http://127.0.0.1:8000
#Press Ctrl-C to quit.
```

Go to [127.0.0.1:8000](http://127.0.0.1:8000) and voilà!, site served.


## 2. Using SASS and Compiling CSS

If you're working on any reasonably sized project, you'll want to use SASS instead of CSS, otherwise, you'll keep repeating yourself and end up with large CSS files that are hard to change.

The way Kirby deals with CSS is that you have all your styles in `assets/css/templates/` for each template you have a CSS file name after the template, e.g. for a template named `post` you need a file `assets/css/templates/post.css` and you load this file by using `<?php echo css('@auto') ?>` in your template.

To use SASS, we need to mirror the CSS file structure, so make a folder next to `assets/css/` named `sass` and make a folder named `templates` inside the `sass` folder. Now we have:

```
Project
|-- assets
|   |-- css
|   |   `-- templates
|   |       |-- home.css
|   |       |-- post.css
|   |       `-- ...
|   |-- sass
|   |   `-- templates
|   |       |-- home.scss
|   |       |-- post.scss
|   |       `-- ...
|   `-- ...
|-- index.php
|-- gulpfile.js
`-- ...
```

Next up, we need to compile `.scss` files inside the `sass` folder automatically while also keeping the same file structure because Kirby relies on that structure to autoload styles.

Since we are already using Gulp, we'll setup SASS with Gulp:

```bash
$ npm install gulp-sass
```

In `gulpfile.js`, require `gulp-sass` and watch/compile `.scss` files:

```js
var gulp          = require('gulp');
    connect       = require('gulp-connect-php'),
+   sass          = require('gulp-sass'); // Require gulp-sass

gulp.task('serve', function() {
    connect.server();
    // Watch .scss files
+   gulp.watch("assets/sass/**/*.scss", ['sass']);
});

// A task that compiles sass to css
+ gulp.task('sass', function() {
+     return gulp.src("assets/sass/**/*.scss")
+         .pipe(sass())
+         // Put compiled files in "assets/css"
+         .pipe(gulp.dest("assets/css"));
+ });

gulp.task('default', ['serve']);
```

To make sure everything works:

1. Move any `.css` file to `assets/sass` and change its type to `.scss`
2. Run `gulp`
3. In your text editor make a small change to any `.scss` file and save to trigger a build, otherwise Gulp won't build your SASS files
4. Go to [127.0.0.1:8000](http://127.0.0.1:8000) and make sure everything works as before

If everything goes according to plan, Gulp will compile SASS and mirror `assets/sass` to `assets/css`.

Now that we setup our styles with Gulp, we can use all the wonderful plugins it has to offer. For example, I use `autoprefixer` to automatically prefix CSS and take care of some browser compatibly issues. I also use `uglifycss` to minify CSS.

Install plugins:

```bash
$ npm install gulp-autoprefixer gulp-uglifycss
```

In `gulpfile.js`:

```js
var gulp          = require('gulp');
    connect       = require('gulp-connect-php'),
    sass          = require('gulp-sass');
+   autoprefixer  = require('gulp-autoprefixer'); // Require autoprefixer
+   uglifycss     = require('gulp-uglifycss'); // Require uglifycss

...

gulp.task('sass', function() {
    return gulp.src("assets/sass/**/*.scss")
        .pipe(sass())
+       .pipe(autoprefixer()) // Use autoprefixer
+       .pipe(uglifycss()) // Use uglifycss
        .pipe(gulp.dest("assets/css"));
});

...
```

Okay, that's it with CSS.


## 3. Auto Refresh the Browser

To speed up the development process we'll use `browser-sync` to sync, auto reload and auto inject styles. So, you won't need to reload the page again every time and you'll see your changes immediately.

Install `browser-sync`:

```bash
$ npm install browser-sync
```

In `gulpfile.js`:

```js
var gulp          = require('gulp');
    connect       = require('gulp-connect-php'),
+   browserSync   = require('browser-sync'); // Require browser-sync
    sass          = require('gulp-sass');
    autoprefixer  = require('gulp-autoprefixer');
    uglifycss     = require('gulp-uglifycss');

gulp.task('serve', function() {
    // Initiate browserSync
+   connect.server({}, function (){
+       browserSync({
+           proxy: '127.0.0.1:8000'
+       });
+   });

    gulp.watch("assets/sass/**/*.scss", ['sass']);

    // Watch for changes in PHP files and reload the browser
+   gulp.watch('**/*.php').on('change', function () {
+       browserSync.reload();
+   });
});

gulp.task('sass', function() {
    return gulp.src("assets/sass/**/*.scss")
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(uglifycss())
        .pipe(gulp.dest("assets/css"))
        // Inject css when changes occur
+       .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
```

Now any time you make a change to a `.php` or `.scss` file the browser will auto reload.


## 4. Showing Your Work to Others

Now that you're proud of what you've accomplished, you want to showcase your work to others but you don't have a PHP server laying around and you can't use GitHub Pages or other free static hosting services because Kirby does not generate static files (sad!). You could use `ngrok` while your computer is online which isn't ideal unless you don't turn off your computer.

Heroku to the rescue! it is an amazing platform as a service which supports all popular languages out of the box, and it has a free tier.

Note: because of Heroku permissions, the panel will not work.

First, [Sign up](https://signup.heroku.com/php?c=70130000001xncDAAQ) for a free Heroku account.

Then, [download](https://devcenter.heroku.com/articles/getting-started-with-php#set-up) the Heroku CLI and log in from the terminal:

```bash
$ heroku login
#Enter your Heroku credentials.
#Email: your@email.com
#Password:
```

Initiate a git repository if you don't already have one:

```bash
$ git init
```

Commit all your code to git, don't forget to add `node_modules` to your `.gitignore`.

Create an app on Heroku:

```bash
$ heroku create PROJECT-NAME
#Creating ⬢ PROJECT-NAME... done
#https://PROJECT-NAME.herokuapp.com/ | https://git.heroku.com/PROJECT-NAME.git
```

Push your code to Heroku:

```bash
$ git push heroku master
```

Heroku will auto detect PHP and will serve your website. Go to the url that you got when you created the app, if you can't find it, go to your [Heroku dashboard](dashboard.heroku.com/apps), click on the app name, on the top right corner click `Open app`.

That's it!
