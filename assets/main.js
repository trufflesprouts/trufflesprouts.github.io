// Hamburger Icon
var nav = document.getElementById("headerNav");
var hamburgerIcon = document.getElementById('hamburger-icon');

function hamburgerFunction() {
  window.scrollTo(0, 0);
  document.getElementsByTagName('body')[0].classList.toggle('stop-scrolling');
  nav.classList.toggle("active");
  hamburgerIcon.classList.toggle("active");
}


var pElms = Array.from(document.getElementsByTagName('p'));
for (var i = 0; i < pElms.length; i++) {
  if (pElms[i].firstChild) {
    if (pElms[i].firstChild.tagName == "IMG") {
      (function(index) {
        pElms[index].firstChild.addEventListener('click', function() {
          pElms[index].firstChild.classList.toggle('clicked');
        });
      })(i);
    }
  }
}
