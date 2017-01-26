var anchors = Array.from(document.getElementsByClassName('link'));
var anchorPositions = [];

// Hover event listeners
for (var i = 0; i < anchors.length; i++) {
  (function (index) {
    anchors[index].addEventListener('mouseenter', function() {
      var element = anchors[index];
      var element_splash = element.previousElementSibling;
      element.className = "link hover";
      element_splash.className = "";
    });
    anchors[index].addEventListener('mouseleave', function() {
      anchors[index].className = "link";
      anchors[index].previousElementSibling.className = "hidden";
    });
    anchorPositions.push(offsetTop(anchors[index]));
  })(i);
}

window.onresize = function(event) {
  anchorPositions = [];
  for (var i = 0; i < anchors.length; i++) {
    anchorPositions.push(offsetTop(anchors[i]));
  }
};

// Highlight section
if (window.innerWidth < 760) {
  highlightSection();
}

// Scroll
window.onscroll = function(){
  highlightSection();
}

function highlightSection() {
  var scrollBarPosition = window.pageYOffset | document.body.scrollTop;
  var midScreen = window.innerHeight/2 - 75;
  var sectionOnCenter = 1;
  for (var i = 0; i < anchorPositions.length; i++) {
    if (scrollBarPosition + midScreen <= anchorPositions[i]) {
      for (var k = 0; k < anchors.length; k++) {
        anchors[k].className = "link";
        anchors[k].previousElementSibling.className = "hidden";
      };
      anchors[i].className = "link hover";
      anchors[i].previousElementSibling.className = "";
      break;
    }
  }
}

function offsetTop(el) {
    var rect = el.getBoundingClientRect(),
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return rect.top + scrollTop;
}
