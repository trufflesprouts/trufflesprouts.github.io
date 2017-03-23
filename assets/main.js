// Hamburger Icon

var hamburgerIcon = document.getElementById('hamburger-icon');

hamburgerIcon.addEventListener('click', function(ev) {
  if (hamburgerIcon.className === 'active') {
    hamburgerIcon.className = '';
  } else {
    hamburgerIcon.className = 'active';
  }
});


/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */

var nav = document.getElementById("headerNav");

function hamburgerFunction() {
  if (nav.className === "nav") {
    nav.className += " active";
  } else {
    nav.className = "nav";
  }
}
