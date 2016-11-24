// Added a function to the string prototype for easy string replacement at any index
String.prototype.replaceAt = function(index, character) {
	return this.substr(0, index) + character + this.substr(index + character.length);
}

// Store UI element
var calcBtnELs = Array.from(document.getElementsByClassName('calc-btn'));
var screenEl = document.getElementById('calc-screen-text');
var screenCalcsEl = document.getElementById('calc-screen-text-bottom');
// Math operations array
var mathOperations = ["+", "-", "/", "*"];
// Initilize calculations
var calculations = "";

// Add enent listener on every button
for (var i = 0; i < calcBtnELs.length; i++) {
	// Immiedietly invoked function to make use of closures
	(function(index) {
		calcBtnELs[index].addEventListener('click', function() {
			var operation = calcBtnELs[index].getAttribute("operation");
			// AC button
			if (operation == "AC") {
				screenEl.textContent = "";
				calculations = "";
			}
			// CE button
			if (operation == "CE") {
				screenEl.textContent = screenEl.textContent.substr(0, screenEl.textContent.length - 1);
				calculations = calculations.replace(/([\/\+\-\*])[0-9]*$|^[0-9]*$/, "$1" + screenEl.textContent);
			}
			// Squareroot button
			if (operation == "√") {
				screenEl.textContent = Math.sqrt(screenEl.textContent);
				calculations = calculations.replace(/([\/\+\-\*])[0-9]*$|^[0-9]*$/, "$1" + screenEl.textContent);
        if (screenEl.textContent.length > 16) {
					var currNum = Number(screenEl.textContent);
					screenEl.textContent = currNum.toPrecision(10);
					calculations = screenEl.textContent;
				}
			}
			// Stop taking input if there isn't enough space on screen
			if ((/[0-9]/.test(operation) || operation == ".") && (screenEl.textContent.length > 15 || calculations.length > 24)) {
				return;
			}
			// Number buttons (and dot)
			if (/[0-9]/.test(operation) || operation == ".") {
				// Don't accept a DOT if one is already on screen
				if (operation == "." && screenEl.textContent.indexOf(".") !== -1) {
					return;
				}
				// Clean math operation off the screen
				if (mathOperations.indexOf(screenEl.textContent) !== -1) {
					screenEl.textContent = "";
				}
				// Update screen
				screenEl.textContent += operation;
				calculations += operation;
			}
			// Math operation buttons
			if (mathOperations.indexOf(operation) !== -1) {
				// If there's already an operation replace it the new one
				if (mathOperations.indexOf(calculations[calculations.length - 1]) !== -1) {
					calculations = calculations.replaceAt(calculations.length - 1, operation);
					screenEl.textContent = screenEl.textContent.replaceAt(0, operation);
					screenCalcsEl.textContent = calculations;
					return;
				}
				// Add operation to the screen
				screenEl.textContent = operation;
				calculations += operation;
			}
			// Result button
			if (operation == "=") {
				// View result on screen
				screenEl.textContent = eval(calculations);
				calculations = eval(calculations);
				// If result is too long, shorten result
				if (screenEl.textContent.length > 16) {
					var currNum = Number(screenEl.textContent);
					screenEl.textContent = currNum.toPrecision(10);
					calculations = screenEl.textContent;
				}
				screenCalcsEl.textContent = "";
				return;
			}
			screenCalcsEl.textContent = calculations;
		});
	})(i);
};

// Fix sticky hover style
function fix()
{
    var el = this;
    var par = el.parentNode;
    var next = el.nextSibling;
    par.removeChild(el);
    setTimeout(function() {par.insertBefore(el, next);}, 0)
}
