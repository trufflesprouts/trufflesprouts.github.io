// Mouse3D
var Mouse3D = (function() {
  var taglineEl = document.getElementById('tagline');
  var taglineElCenter = getCenter(taglineEl);

  document.addEventListener('mousemove', function(event) {
    var xDistance = taglineElCenter.x - event.clientX;
    var yDistance = taglineElCenter.y - event.clientY;

    setTextShadow(xDistance,yDistance);
  });

  function depthValuesGenerator(x,y) {
    if (x < -600) {
      diff = x + 600;
      x = -600 + diff/2;
    }

    var xValue = x/600;
    var yValue = y/600;
    return [
      {x:xValue * 1, y:yValue * 1},
      {x:xValue * 2, y:yValue * 2},
      {x:xValue * 3, y:yValue * 3},
      {x:xValue * 4, y:yValue * 4},
      {x:xValue * 5, y:yValue * 5},
      {x:xValue * 6, y:yValue * 6}
    ]
  }

  function setTextShadow(x,y) {
    var depthValues = depthValuesGenerator(x,y);

    var textShadow = depthValues[0].x+"px "+depthValues[0].y+"px 0 #FF0082, "+depthValues[1].x+"px "+depthValues[1].y+"px 0 #FF0082, "+depthValues[2].x+"px "+depthValues[2].y+"px 0 #FF0082, "+depthValues[3].x+"px "+depthValues[3].y+"px 0 #FF0082, "+depthValues[4].x+"px "+depthValues[4].y+"px 0 #FF0082, "+depthValues[5].x+"px "+depthValues[5].y+"px 0 #FF0082";

    taglineEl.style.textShadow = textShadow;
  }

  function getCenter(el) {
    var elWidth = el.offsetWidth;
    var elHeight = el.offsetHeight;

    var xPosition = 0;
    var yPosition = 0;

    while (el) {
      if (el.tagName == "BODY") {
        // deal with browser quirks with body/window/document and page scroll
        var xScrollPos = el.scrollLeft || document.documentElement.scrollLeft;
        var yScrollPos = el.scrollTop || document.documentElement.scrollTop;

        xPosition += (el.offsetLeft - xScrollPos + el.clientLeft);
        yPosition += (el.offsetTop - yScrollPos + el.clientTop);
      } else {
        xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
      }

      el = el.offsetParent;
    }

    return {
      x: xPosition + (elWidth/2),
      y: yPosition
    };
  }

})();
