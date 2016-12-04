var compass = (function() {
	var compassNeedle = document.getElementById('compass-needle'),
			metaTheme = document.getElementsByTagName('meta')[4],
			outerContainer = document.getElementsByClassName('outer-container')[0],
			timeEl = document.getElementById('time'),
			timeTxt = document.getElementById('time-text'),
			environmentZero = document.getElementsByClassName('environment-0')[0],
			environmentOne = document.getElementsByClassName('environment-1')[0],
			environmentTwo = document.getElementsByClassName('environment-2')[0],
			environmentThree = document.getElementsByClassName('environment-3')[0];

	function updateTime() {
		var date = new Date();
		var current_hour = date.getHours();
		var current_minute = date.getMinutes();
		var t = "AM";
		if (current_hour > 12) {
				t = "PM";
				current_hour -= 12;
		}
		current_hour = current_hour < 10 ? "0" + current_hour : current_hour;
		current_minute = current_minute < 10 ? "0" + current_minute : current_minute;
		timeEl.textContent = current_hour + ":" + current_minute + " " + t;
	}

	function changeEnviroment() {
		var date = new Date();
		var current_hour = date.getHours();
		var timeOfDay;
		if (current_hour > 5 && current_hour < 17) {
			timeOfDay = "morning";
		} else if (current_hour >= 17 && current_hour < 20) {
			timeOfDay = "evening";
		} else {
			timeOfDay = "night";
		}
		timeTxt.textContent = "Good " + timeOfDay[0].toUpperCase() + timeOfDay.substr(1,timeOfDay.length) + "!";
		if (outerContainer.classList) {
		  outerContainer.classList.add(timeOfDay);
			environmentTwo.classList.add(timeOfDay+"-grass");
		} else {
			outerContainer.className += ' ' + timeOfDay;
			environmentTwo.className += ' ' + timeOfDay +"-grass";
		}
		environmentZero.src = environmentZero.src.replace(/(morning|evening|night)/g, timeOfDay);
		environmentOne.src = environmentOne.src.replace(/(morning|evening|night)/g, timeOfDay);
		environmentThree.src = environmentThree.src.replace(/(morning|evening|night)/g, timeOfDay);
		metaTheme.content = getComputedStyle(environmentTwo).getPropertyValue("background-color");
	}

	changeEnviroment();

	if (window.DeviceOrientationEvent) {
		if (typeof window.orientation == 'undefined') {
			document.body.innerHTML = "<h1 class='unsupported-msg'>Sorry, your device doesn't have a magnetometer.</h1>";
			return;
		};
	  // Listen for the deviceorientation event and handle the raw data
	  window.addEventListener('deviceorientationabsolute', function(eventData) {
			var yAxis = eventData.gamma;
	    var xAxis = eventData.beta;
	    var zAxis = eventData.alpha;

			updateNeedle(zAxis);
			moveBackground(yAxis);
			updateTime();

	  }, false);
	} else {
	  document.body.innerHTML = "<h1 class='unsupported-msg'>Sorry, your browser can't run this app.</h1>";
	}

	function updateNeedle(z) {
		compassNeedle.style.transform = "translate(-50%,-50%) rotate("+z+"deg)";
	}

	function moveBackground(y) {
		environmentOne.style.left = (50 + y/30) + "%";
	}
})();
