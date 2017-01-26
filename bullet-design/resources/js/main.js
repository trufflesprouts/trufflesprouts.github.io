$(function() {
	$(".dropdown-toggle").on("click", function() {
		$(".dropdown").toggleClass("open");
	});
	$('.hyphenate').hyphenate('en-us');
	var cw = $('.iconSDP').width();
	$('.iconSDP').css({
		'height': cw + 'px'
	});
  $(window).resize(function() {
    var cw = $('.iconSDP').width();
  	$('.iconSDP').css({
  		'height': cw + 'px'
  	});
  });
});
