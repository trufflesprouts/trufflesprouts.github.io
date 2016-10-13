$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});


$(document).ready(function(){
	$('nav div').mouseenter(function() {
        $(this).addClass('changeBackgroundNav');
  });
  $('nav div').mouseleave(function() {
        $(this).removeClass('changeBackgroundNav');
  });
});

$(document).ready(function(){
	$('.card').mouseenter(function() {
        $(this).addClass('changeBorderCard');
  });
  $('.card').mouseleave(function() {
        $(this).removeClass('changeBorderCard');
  });
});

$(document).ready(function(){
	$('.film').mouseenter(function() {
		$(this).removeClass('col-md-2');
		$(this).addClass('col-md-7');
		$(this).siblings().removeClass('col-md-2');
		$(this).siblings().addClass('col-md-1');
		$(this).siblings().addClass('darkenFilm');
  });
  $('.film').mouseleave(function() {
   	$(this).removeClass('col-md-7');
    $(this).addClass('col-md-2');
		$(this).siblings().removeClass('col-md-1');
    $(this).siblings().addClass('col-md-2');
		$(this).siblings().removeClass('darkenFilm');
  });
});


