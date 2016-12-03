var xoxo = {
	init: function () {
		this.userChoice = "X";
		this.computerSymbol = "O";
		this.acceptPlay = true;
		this.circleEl = '<svg class="circleSVG" style="opacity:0;" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 200 200">'+
		'<path fill="none" stroke="#AA8965" stroke-width="20" stroke-miterlimit="0" d="M 100, 100 m -60, 0 a 60,60 0 1,0 120,0 a 60,60 0 1,0 -120,0"/>'+
		'</svg>';
		this.exEl =  '<svg style="opacity:0;" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 200 200">'+
		'<path fill="none" stroke="#AA8965" stroke-width="20" stroke-miterlimit="0" d="M 160, 40 L 40, 160"/>'+
		'</svg>'+
		'<svg class="secondStroke" style="opacity:0;" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 200 200">'+
		'<path fill="none" stroke="#AA8965" stroke-width="20" stroke-miterlimit="0" d="M 40, 40 L 160, 160"/>'+
		'</svg>';
		this.gameSquence = [];
		for (var i = 0; i < 9; i++) {
			this.gameSquence.push(null);
		};
		this.cacheDom();
		this.bindEvents();
	},
	cacheDom: function () {
		this.userPrompt = $$('.user-prompt');
		this.xButton = this.userPrompt.find('#X');
		this.oButton = this.userPrompt.find('#O');
		this.backgroundDisable = $$('.background-disable');
		this.board = $$('.board');
		this.boardComponents = this.board.find('.board-component');
	},
	bindEvents: function () {
		this.xButton.touch(this.registerChoice);
		this.oButton.touch(this.registerChoice);
		this.boardComponents.touch(this.registerPlay);

	},
	registerChoice: function () {
		xoxo.userChoice = this.id;
		xoxo.computerSymbol = xoxo.userChoice === "X" ? "O" : "X";
		xoxo.removePrompt();
	},
	revealPrompt: function () {
		xoxo.userPrompt.style('display','block');
		xoxo.backgroundDisable.style('display','block');
		setTimeout(function(){
			xoxo.userPrompt.style('opacity','1');
			xoxo.backgroundDisable.style('opacity','1');
		}, 100);
	},
	removePrompt: function () {
		this.userPrompt.style('opacity','0');
		this.backgroundDisable.style('opacity','0');
		setTimeout(function(){
			xoxo.userPrompt.style('display','none');
			xoxo.backgroundDisable.style('display','none');
		}, 500);
	},
	registerPlay: function () {
		if (xoxo.acceptPlay) {
			// Check if a symbol already exists
			if (this.innerHTML) {
				return;
			}
			xoxo.renderPlay.call(this, xoxo.userChoice);
			var indexOfPlay = Array.from(this.parentNode.children).indexOf(this);
			xoxo.gameSquence[indexOfPlay] = xoxo.userChoice;
			if (xoxo.gameEnd()) {
				setTimeout(function () {
					xoxo.declareWinner(xoxo.userChoice);
				}, 500);
				return;
			};
			// if board is full, terminate
			if (xoxo.gameSquence.indexOf(null) == -1) {
				setTimeout(function () {
					xoxo.declareWinner("tie");
				}, 500);
				return;
			}
			xoxo.acceptPlay = false;
			setTimeout(function () {
				xoxo.computerPlay();
				xoxo.acceptPlay = true;
				if (xoxo.gameEnd()) {
					xoxo.declareWinner(xoxo.computerSymbol);
				};
			}, 500);
		}
	},
	renderPlay: function (userChoice) {
		var self = this;
		if (userChoice == "O") {
			this.innerHTML = xoxo.circleEl;
			xoxo.animatDraw.call(this, $$(self).find('svg')[0]);
		} else {
			this.innerHTML = xoxo.exEl;
			xoxo.animatDraw.call(this, $$(self).find('svg')[0]);
			setTimeout(function () {
				xoxo.animatDraw.call(this, $$(self).find('svg')[1]);
			}, 100);
		}
	},
	animatDraw: function (svg) {
		$$(svg).style('opacity', '1');
	  var path = $$(svg).find('path')[0];
	  var length = path.getTotalLength()
	  // Clear any previous transition
	  path.style.transition = path.style.WebkitTransition =
	    'none';
	  // Set up the starting positions
	  path.style.strokeDasharray = length + ' ' + length;
	  path.style.strokeDashoffset = length;
	  // Trigger a layout so styles are calculated & the browser
	  // picks up the starting position before animating
	  path.getBoundingClientRect();
	  // Define our transition
	  path.style.transition = path.style.WebkitTransition =
	    'stroke-dashoffset 0.2s ease-in-out';
	  // Go!
	  path.style.strokeDashoffset = '0';
	},
	gameEnd: function () {
		var gSq = this.gameSquence;
		// Check diagnal win
		if (gSq[0] != null && gSq[0] == gSq[4] && gSq[4] == gSq[8]) {
			return true;
		}
		// Check diagnal win
		if (gSq[2] != null && gSq[2] == gSq[4] && gSq[4] == gSq[6]) {
			return true;
		}
		// Check vertical and horizontal win
		for (var i = 0; i < gSq.length/3; i++) {
			if (gSq[3*i] != null && gSq[3*i] == gSq[(3*i)+1] && gSq[(3*i)+1] == gSq[(3*i)+2]) {
				return true;
			}
			if (gSq[i] != null && gSq[i] == gSq[i+3] && gSq[i+3] == gSq[i+6]) {
				return true;
			}
		}
		return false;
	},
	computerPlay: function () {
		var compMove = null;
		var gSq = this.gameSquence;
		for (var i = 0; i < gSq.length/3; i++) {
			if (gSq[i*3] == xoxo.userChoice && gSq[(i*3) + 2] == null && gSq[i*3] === gSq[(i*3)+1]) {
				console.log("happended at " + ((i*3) + 2));
				compMove = (i*3) + 2;
			}
			if (gSq[(i*3)+1] == xoxo.userChoice && gSq[i*3] == null && gSq[(i*3)+1] === gSq[(i*3)+2]) {
				console.log("happended at " + (i*3));
				compMove = i*3;
			}
			if (gSq[i*3] == xoxo.userChoice && gSq[(i*3) + 1] == null && gSq[i*3] === gSq[(i*3)+2]) {
				console.log("happended at " + ((i*3) + 1));
				compMove = (i*3) + 1;
			}
			if (gSq[i] == xoxo.userChoice && gSq[i+6] == null && gSq[i] === gSq[i+3]) {
				console.log("happended at " + (i+6));
				compMove = i+6;
			}
			if (gSq[i+3] == xoxo.userChoice && gSq[i] == null && gSq[i+3] === gSq[i+6]) {
				console.log("happended at " + (i));
				compMove = i;
			}
			if (gSq[i] == xoxo.userChoice && gSq[i+3] == null && gSq[i] === gSq[i+6]) {
				console.log("happended at " + (i+3));
				compMove = i+3;
			}
		}
		if (gSq[0] == xoxo.userChoice && gSq[8] == null && gSq[0] === gSq[4]) {
			console.log("happended at " + (8));
			compMove = 8;
		}
		if (gSq[4] == xoxo.userChoice && gSq[0] == null && gSq[4] === gSq[8]) {
			console.log("happended at " + (0));
			compMove = 0;
		}
		if (gSq[0] == xoxo.userChoice && gSq[4] == null && gSq[0] === gSq[8]) {
			console.log("happended at " + (4));
			compMove = 4;
		}
		if (gSq[2] == xoxo.userChoice && gSq[6] == null && gSq[2] === gSq[4]) {
			console.log("happended at " + (6));
			compMove = 6;
		}
		if (gSq[4] == xoxo.userChoice && gSq[2] == null && gSq[4] === gSq[6]) {
			console.log("happended at " + (2));
			compMove = 2;
		}
		if (gSq[2] == xoxo.userChoice && gSq[4] == null && gSq[2] === gSq[6]) {
			console.log("happended at " + (4));
			compMove = 4;
		}
		if (compMove == null || gSq[compMove] != null) {
			compMove = Math.floor(Math.random() * 9);
			// Check if a symbol already exists
			while (gSq[compMove] != null) {
				compMove = Math.floor(Math.random() * 9);
			}
		}
		gSq[compMove] = this.computerSymbol;
		var renderLocation = this.board[0].children[compMove];
		this.renderPlay.call(renderLocation, this.computerSymbol);
	},
	declareWinner: function (winner) {
		xoxo.revealPrompt();
		if (winner === "tie") {
			xoxo.userPrompt[0].innerHTML = '<h1>It\'s A <span class="winnerSymb">Tie!</span></h1>';
		} else if (winner == xoxo.userChoice) {
			xoxo.userPrompt[0].innerHTML = '<h1>You <span class="winnerSymb">Won!</span></h1>';
		} else {
			xoxo.userPrompt[0].innerHTML = '<h1>You <span class="winnerSymb">Lost!</span></h1>';
		}
		xoxo.userPrompt[0].innerHTML += '<h1 class="restartBtn">Play Again?</h1>';
		xoxo.restartBtn = this.userPrompt.find('.restartBtn');
		xoxo.restartBtn.touch(xoxo.restart);
	},
	restart: function () {
		xoxo.gameSquence = [];
		for (var i = 0; i < 9; i++) {
			xoxo.gameSquence.push(null);
		};
		$$('svg').remove();
		xoxo.removePrompt();
	}
}

xoxo.init();
