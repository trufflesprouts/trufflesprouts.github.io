var parallax = function() {
  var section1 = document.getElementById('section-1');
  var newPadding = (700 - window.pageYOffset/2) + "px";
  section1.style.paddingTop = newPadding;
};

document.addEventListener('scroll', ev => {
  if (window.innerWidth >= 1024) {
    parallax();
  };
});
