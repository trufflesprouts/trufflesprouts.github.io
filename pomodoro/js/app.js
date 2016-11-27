var timer = {
	runningDuration: 0, // Duration of the current timer, so the progress bar doesn't reset every time a user pauses
	start: function(duration, display) {
		var start = Date.now(),
			self = this,
			diff,
			minutes,
			seconds;

		self.timerRunning = true;

		function timerFunc() {
			// get the number of seconds that have elapsed since startTimer() was called
			diff = duration - (((Date.now() - start) / 1000) | 0);
			// if we reached end of timer
			if (diff <= 0) {
				timer.stop();

				// Play alarm tone
				var audioEls = Array.from(document.getElementsByTagName('audio'));
				if (audioEls[0]) {
					document.body.removeChild(audioEls[0]); // If one already exists, remove it
				}
				var audioEl = document.createElement("audio");
				audioEl.src = "./Shooting_star.ogg";
				audioEl.autoplay = "true";
				document.body.appendChild(audioEl);

				// Style the timer box while the alarm is ringing
				timerEl.style.backgroundColor = "#FF6A6A";
				timerEl.style.color = "#fff"
				timeEl.style.color = "#fff";
				setTimeout(function () {
					timerEl.style.backgroundColor = "#fff";
					timerEl.style.color = "#000"
					timeEl.style.color = "#FF6A6A";
				}, 7000);

				// Start the next session/break
				if (timerType.textContent == "Session") {
					timer.runningDuration = 60 * breakLength ;
					timerType.textContent = "Break!";
					timer.start(breakLength*60 + 1, timeEl);
				} else {
					timer.runningDuration = 60 * sessionLength;
					timerType.textContent = "Session";
					timer.start(sessionLength * 60 + 1, timeEl);
				}

			}

			// Get the minutes and seconds and style them
			minutes = parseInt(diff / 60, 10);
			seconds = parseInt(diff % 60, 10);
			minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

			// Progress bar
			var progress = (self.runningDuration - diff) / self.runningDuration * 100;
			progressBar.style.width = progress +"%";

			currDuration = diff;

			// Update webpage
			titleEl.textContent = minutes + ":" + seconds + " " + timerType.textContent;
			display.textContent = minutes + ":" + seconds;
		};
		// we don't want to wait a full second before the timer starts
		timerFunc();
		self.timerInterval = setInterval(timerFunc, 1000);

	},
	stop: function() {
		this.timerRunning = false;
		clearInterval(this.timerInterval);
		this.timerInterval = null;
	}
}

function styleTime(time) {
	if (time < 10) {
		return "0" + time + ":00";
	} else {
		return time + ":00";
	}
}

var titleEl = document.getElementsByTagName('title')[0];
var startBtnEl = document.getElementById('start-btn');
var timerEl = document.getElementById('timer');
var timeEl = document.getElementById('time');
var timerType = document.getElementById('timer-type');
var sessionLength = document.getElementById('sessionLength').textContent;
var breakLength = document.getElementById('breakLength').textContent;
var currDuration = 60 * sessionLength;
timer.runningDuration = 60 * sessionLength;
time.textContent = styleTime(sessionLength);
var progressBar = document.getElementById('progress-bar');

//////////////////// Timer Start/Pause ////////////////////
startBtnEl.addEventListener("click", function () {
	if (timeEl.textContent == "00:00") {
		return;
	}
	if (timer.timerRunning) {
		timer.stop();
	} else {
		timer.start(currDuration, timeEl);
	}
});

//////////////////// Control Buttons ////////////////////
var controlBtnEls = Array.from(document.querySelectorAll('.controls button'));
for (var i = 0; i < controlBtnEls.length; i++) {
	controlBtnEls[i].addEventListener("click", function () {
		self = this;
		var counterEl = this.parentNode.childNodes[3];
		if (this.value == "add") {
			if (counterEl.textContent < 60) {
				counterEl.textContent = (counterEl.textContent | 0) + 5;
			}
		} else {
			if (counterEl.textContent > 5) {
				counterEl.textContent = (counterEl.textContent | 0) - 5;
			}
		}
	});
}

//////////////////// Reset Button ////////////////////
var resetBtnEl = document.getElementById('reset-btn');
resetBtnEl.addEventListener("click", function() {
	timer.stop();

	sessionLength = document.getElementById('sessionLength').textContent;
	breakLength = document.getElementById('breakLength').textContent;
	currDuration = 60 * sessionLength;

	titleEl.textContent = "Pomodoro Clock";
	timerType.textContent = "Session";
	timer.runningDuration = 60 * sessionLength;
	time.textContent = styleTime(sessionLength);

	progressBar.style.width = "0%";
	timerEl.style.backgroundColor = "#fff";
	timerEl.style.color = "#000"
	timeEl.style.color = "#FF6A6A";

	var audioEl = Array.from(document.getElementsByTagName('audio'));
	if (audioEl[0]) {
		document.body.removeChild(audioEl[0]);
	}
});
