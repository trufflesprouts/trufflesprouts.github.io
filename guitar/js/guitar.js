var Guitar = {
	init: function () {
		this.pointerHeld = false;
		this.cacheDom();
		this.bindEvents();
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
	playNote: function (note) {
    randomNoteNum = Math.floor(Math.random() *2);
    this.audio = new Audio('./sounds/'+note+randomNoteNum+'.mp3');
    this.audio.play();
	}
}

Guitar.init();
