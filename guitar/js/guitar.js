var Guitar = {
	init: function () {
		this.pointerHeld = false;
		this.cacheDom();
		this.bindEvents();
    this.downloadAudio();
	},
	cacheDom: function () {
    this.aether = document.getElementById('aether');
    this.guitarStringGroup = document.getElementById('guitar-string-group');
		this.guitarStrings = Array.from(document.getElementsByClassName('guitar-string'));
	},
	bindEvents: function () {
    this.aether.addEventListener('mousedown', function(ev) {
      Guitar.pointerHeld = true;
    });
    this.aether.addEventListener('mouseup', function(ev) {
      Guitar.pointerHeld = false;
    });
		this.aether.addEventListener('touchmove', function(ev) {
			ev.preventDefault();
			var elem = document.elementFromPoint(ev.targetTouches[0].pageX, ev.targetTouches[0].pageY);
			if (elem != Guitar.guitarStringGroup && elem != Guitar.aether) {
				Guitar.animate(elem);
				Guitar.playNote(elem.dataset.note);
			}
		});
    for (var i = 0; i < this.guitarStrings.length; i++) {
      this.guitarStrings[i].addEventListener('mousedown', function(ev) {
        Guitar.pointerHeld = true;
      });
      this.guitarStrings[i].addEventListener('mouseup', function(ev) {
        Guitar.pointerHeld = false;
      });
      (function (index) {
        Guitar.guitarStrings[index].addEventListener('click', function(ev) {
          Guitar.animate(Guitar.guitarStrings[index]);
          Guitar.playNote(Guitar.guitarStrings[index].dataset.note);
        });
        Guitar.guitarStrings[index].addEventListener('mouseenter', function(ev) {
          if (Guitar.pointerHeld) {
            Guitar.animate(Guitar.guitarStrings[index]);
            Guitar.playNote(Guitar.guitarStrings[index].dataset.note);
          }
        });
      })(i);
    }
	},
	animate: function (guitarString) {
    guitarString.className = "guitar-string string-vibrate";
    setTimeout(() => {
      guitarString.className = "guitar-string";
    }, 2000);
	},
  downloadAudio: function () {
    this.sounds = {};
    var notes = ["A","B","C","D","E","F"];
    for (var i = 0; i < notes.length; i++) {
      this.sounds[notes[i] + 0] = new Audio('./sounds/'+notes[i]+0+'.mp3');
      this.sounds[notes[i] + 1] = new Audio('./sounds/'+notes[i]+1+'.mp3');
    }
  },
	playNote: function (note) {
    randomNoteNum = Math.floor(Math.random() *2);
    this.sounds[note + randomNoteNum].play();

	}
}

Guitar.init();
