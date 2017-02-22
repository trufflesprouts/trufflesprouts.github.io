'use strict';

// Hamburger Icon
var hamburgerIcon = document.getElementById('hamburger-icon');
hamburgerIcon.addEventListener('click', ev => {
  if (hamburgerIcon.className === 'active') {
    hamburgerIcon.className = '';
  } else {
    hamburgerIcon.className = 'active';
  }
});


/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function hamburgerFunction() {
  var nav = document.getElementById("myTopnav");
  if (nav.className === "topnav") {
    nav.className += " responsive";
  } else {
    nav.className = "topnav";
  }
}
