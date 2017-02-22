// Slider
var Slider = (function() {
  var sliderElm = document.getElementById('slider');
  var leftArrow = document.getElementById('left-arrow');
  var rightArrow = document.getElementById('right-arrow');
  var slides = Array.from(document.querySelectorAll('#slider .slide'));

  var currentSlide = 0;

  leftArrow.addEventListener('click', ev => {
    changeSlide("left");
  });

  rightArrow.addEventListener('click', ev => {
    changeSlide("right");
  });

  if (window.innerWidth <= 640) {
    setInterval(() => {
      changeSlide("right");
    }, 4500);
  }

  function changeSlide(direction) {
    if (direction === "left") {
      slides[currentSlide].style.opacity = 0;
      currentSlide = currentSlide - 1;
      if (currentSlide < 0) {
        currentSlide = slides.length - 1;
      }
      slides[currentSlide].style.opacity = 1;
    } else if (direction === "right") {
      slides[currentSlide].style.opacity = 0;
      currentSlide = currentSlide + 1;
      if (currentSlide > slides.length - 1) {
        currentSlide = 0;
      }
      slides[currentSlide].style.opacity = 1;
    }
  }
})();
