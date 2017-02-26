function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

var contactEl = document.getElementById('contact');

function revealContact() {
  contactEl.style.display = "block";
  setTimeout(function() {
    contactEl.style.transform = "translateY(0)";
  }, 10);
}

function hideContact() {
  contactEl.style.transform = "translateY(100%)";
  setTimeout(function() {
    contactEl.style.display = "none";
  }, 300);
}

var Pagination = (function () {
  var sliderEl = document.getElementById('slider');
  var paginationEl = document.getElementById('pagination');

  addPagination();

  window.addEventListener('resize', function(ev) {
    if (window.innerWidth > 640) {
      addPagination();
    }
  });

  function addPagination() {
    var containerWidth = Array.from(document.getElementsByClassName('container'))[0].offsetWidth;
    var mediaEl = Array.from(document.getElementsByClassName('media'))[0];
    var mediaWidth = getElementWidth(mediaEl);
    var mediaDisplayed = Math.floor(containerWidth/mediaWidth);
    var pagesNum = Math.floor(11/mediaDisplayed) + 1;
    paginationEl.innerHTML = '';
    for (var i = 0; i < pagesNum; i++) {
      paginationEl.innerHTML += '<div data-index='+i+' class="atom"></div>';
    }
    var atoms = Array.from(document.getElementsByClassName('atom'));
    for (var i = 0; i < atoms.length; i++) {
      (function (index) {
        atoms[index].addEventListener('click', function(ev) {
          var siblings = getSiblings(atoms[index]);
          for (var i = 0; i < siblings.length; i++) {
            siblings[i].style.backgroundColor = "transparent";
          }
          atoms[index].style.backgroundColor = "rgb(134, 134, 134)";
          var transX = - (atoms[index].dataset.index) * (mediaWidth*mediaDisplayed);
          sliderEl.style.transform = "translateX("+transX+"px)";
        });
      })(i);
    }
  }

  function getElementWidth(element) {
    var style = element.currentStyle || window.getComputedStyle(element),
        width = element.offsetWidth,
        margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    return width + margin;
  }

  function getSiblings(elem) {
    var siblings = [];
    var sibling = elem.parentNode.firstChild;
    var skipMe = elem;
    for ( ; sibling; sibling = sibling.nextSibling )
    if ( sibling.nodeType == 1 && sibling != elem )
    siblings.push( sibling );
    return siblings;
  }
})();

var ScrollHighlight = (function () {
  var anchors = Array.from(document.getElementsByClassName('media'));
  var anchorPositions = [];

  for (var i = 0; i < anchors.length; i++) {
    anchorPositions.push(offsetTop(anchors[i]));
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
    if (window.innerWidth < 760) {
      debouncedhighlightSection();
    }
  }

  var debouncedhighlightSection = debounce(highlightSection, 100);

  function highlightSection() {
    var scrollBarPosition = window.pageYOffset | document.body.scrollTop;
    var midScreen = window.innerHeight/2 - 75;
    var sectionOnCenter = 1;
    for (var i = 0; i < anchorPositions.length; i++) {
      if ((scrollBarPosition + (midScreen*0.7))  <= anchorPositions[i]) {
        for (var k = 0; k < anchors.length; k++) {
          anchors[k].className = "media";
        };
        anchors[i].className = "media colored";
        break;
      }
    }
  }

  function offsetTop(el) {
      var rect = el.getBoundingClientRect(),
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return rect.top + scrollTop;
  }

})();
