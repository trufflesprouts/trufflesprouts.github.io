'use strict';

var Pathfinder = function () {
  var State = {
    grid: genGrid(),
    start: [0, 0],
    end: [0, 0],
    mouseHeld: { status: false, type: 0 },
    startMoveable: false,
    endMoveable: false,
    previousTouchCell: false,
    searching: false,
    previousPath: false
  };

  var containerEl = document.getElementById('container');
  var gridEl = document.getElementById('grid');
  var searchBtn = document.getElementById('search');
  var clearWallsBtn = document.getElementById('clearWalls');
  var infoBtn = document.getElementById('info');
  var alertEl = document.getElementById('alert');
  var gridHeight = State.grid.length;
  var gridWidth = State.grid[0].length;
  paintGrid(State.grid);
  var gridCells = Array.from(document.getElementsByClassName('grid__cell'));
  setStartAndEnd(genStartEnd(State.grid).start, genStartEnd(State.grid).end);
  attachEvents();

  function genGrid() {
    var cellWidth = 30;

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    var gridWidth = Math.floor(windowWidth / cellWidth);
    var gridHeight = Math.floor(windowHeight / cellWidth);

    var grid = [];

    for (var i = 0; i < gridHeight; i++) {
      var row = [];
      for (var j = 0; j < gridWidth; j++) {
        row.push(0);
      }
      grid.push(row);
    }
    return grid;
  }

  function paintGrid(grid) {
    gridEl.style.width = gridWidth * 30 + "px";
    gridEl.style.height = gridHeight * 30 + "px";
    var gridString = "";

    for (var i = 0; i < gridHeight; i++) {
      for (var j = 0; j < gridWidth; j++) {
        gridString += '<div class="grid__cell" data-yindex=' + i + ' data-xindex=' + j + '></div>';
      }
    }

    gridEl.innerHTML = gridString;
  }

  function genStartEnd(grid) {
    var startXCoord = Math.floor(gridWidth * 0.2) - 1;
    var endXCoord = Math.floor(gridWidth * 0.8) + 1;
    var yCoord = Math.floor(gridHeight / 2);

    return {
      start: [startXCoord, yCoord],
      end: [endXCoord, yCoord]
    };
  }

  function getStartEndElements() {
    var startEl = document.querySelectorAll('[data-xindex~="' + State.start[0] + '"][data-yindex~="' + State.start[1] + '"]')[0];
    var endEl = document.querySelectorAll('[data-xindex~="' + State.end[0] + '"][data-yindex~="' + State.end[1] + '"]')[0];
    return {
      start: startEl,
      end: endEl
    };
  }

  function paintStartEnd(paint) {
    if (!paint) {
      getStartEndElements().start.classList.remove("start");
      getStartEndElements().end.classList.remove("end");
    } else {
      getStartEndElements().start.classList.add("start");
      getStartEndElements().end.classList.add("end");
    }
  }

  function setStartAndEnd(start, end) {
    paintStartEnd(false);
    State.start = start;
    State.end = end;
    paintStartEnd(true);
  }

  function attachEvents() {
    document.addEventListener('mouseup', function (ev) {
      State.startMoveable = false;
      State.endMoveable = false;
      State.mouseHeld.status = false;
    });
    document.addEventListener('touchmove', function (ev) {
      // ev.preventDefault();
      var cell = document.elementFromPoint(ev.targetTouches[0].pageX, ev.targetTouches[0].pageY);
      var type = getCellType(cell);
      if (cell === State.previousTouchCell) {
        return;
      }
      State.previousTouchCell = cell;
      toggleWall(cell, type);
    });
    for (var i = 0; i < gridCells.length; i++) {
      (function (i) {
        gridCells[i].addEventListener('click', function (ev) {
          var type = getCellType(gridCells[i]);
          toggleWall(gridCells[i], type);
        });
        gridCells[i].addEventListener('mousedown', function (ev) {
          State.mouseHeld.status = true;
          State.mouseHeld.type = getCellType(gridCells[i]);
          console.log(State.mouseHeld.type);
          var StartOrEnd = isStartOrEnd(gridCells[i]);
          if (StartOrEnd === "start") {
            State.startMoveable = true;
          }
          if (StartOrEnd === "end") {
            State.endMoveable = true;
          }
        });
        gridCells[i].addEventListener('mouseenter', function (ev) {
          if (State.startMoveable) {
            var newStart = getCellCoords(gridCells[i]);
            setStartAndEnd(newStart, State.end);
          } else if (State.endMoveable) {
            var newEnd = getCellCoords(gridCells[i]);
            setStartAndEnd(State.start, newEnd);
          } else if (State.mouseHeld.status) {
            toggleWall(gridCells[i], State.mouseHeld.type);
          }
        });
      })(i);
    }

    searchBtn.addEventListener('click', function (ev) {
      toggleSearch();
    });

    clearWallsBtn.addEventListener('click', function (ev) {
      clearWalls();
    });

    infoBtn.addEventListener('click', function (ev) {
      togglelInfo();
    });
  }

  function togglelInfo() {
    gridEl.classList.toggle("infoRevealed");
  }

  function getCellType(cell) {
    return cell.classList.contains("wall") ? 1 : 0;
  }

  function getCellCoords(cell) {
    return [parseInt(cell.dataset.xindex), parseInt(cell.dataset.yindex)];
  }

  function toggleWall(cell, type) {
    if (!State.searching) {
      if (isStartOrEnd(cell)) {
        return;
      }
      var xIndex = cell.dataset.xindex;
      var yIndex = cell.dataset.yindex;

      if (type === 0) {
        if (State.grid[yIndex][xIndex] === 0) {
          cell.classList.add("wall");
          State.grid[yIndex][xIndex] = 1;
        }
      } else if (type === 1) {
        if (State.grid[yIndex][xIndex] === 1) {
          cell.classList.remove("wall");
          State.grid[yIndex][xIndex] = 0;
        }
      }
    }
  }

  function clearWalls() {
    for (var i = 0; i < gridHeight; i++) {
      for (var j = 0; j < gridWidth; j++) {
        State.grid[i][j] = 0;
      }
    }
    for (var _i = 0; _i < gridCells.length; _i++) {
      gridCells[_i].classList.remove("wall");
    }
  }

  function isStartOrEnd(cell) {
    var cellCoords = getCellCoords(cell);
    if (cellCoords[0] == State.start[0] && cellCoords[1] == State.start[1]) {
      return "start";
    }
    if (cellCoords[0] == State.end[0] && cellCoords[1] == State.end[1]) {
      return "end";
    }
    return false;
  }

  function toggleSearch() {
    if (State.searching) {
      clearPath(State.previousPath);
      State.searching = false;
      searchBtn.innerHTML = "Search";
    } else {
      var world = deepCopyArr(State.grid);
      var startPoint = State.start.slice();
      var endPoint = State.end.slice();
      var path = findPath(world, startPoint, endPoint);
      if (!path) {
        if (alertEl.style.display == "none") {
          alertEl.style.display = "block";
          setInterval(function () {
            alertEl.style.display = "none";
          }, 3000);
        }
        return;
      }
      State.searching = true;
      searchBtn.innerHTML = "Clear";
      State.previousPath = path;
      animatePath(path);
    }
  }

  var animateInterval = void 0;

  function animatePath(path) {
    var animateSpeed = path.length > 15 ? 20 : 70;
    var i = 0;
    animateInterval = setInterval(function () {
      console.log("bo");
      if (i >= path.length - 1) {
        clearInterval(animateInterval);
        return;
      }
      getCellFromCoords(path[i]).classList.add("path");
      i++;
    }, animateSpeed);
  }

  function clearPath(path) {
    clearInterval(animateInterval);
    for (var i = 0; i < path.length; i++) {
      getCellFromCoords(path[i]).classList.remove("path");
    }
  }

  function getCellFromCoords(coords) {
    return document.querySelectorAll('[data-xindex~="' + coords[0] + '"][data-yindex~="' + coords[1] + '"]')[0];
  }

  function deepCopyArr(arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      var row = [];
      for (var j = 0; j < arr[i].length; j++) {
        row.push(arr[i][j]);
      }
      newArr.push(row);
    }
    return newArr;
  }

  function findPath(grid, start, goal) {
    var xLocation = start[0];
    var yLocation = start[1];

    var location = {
      xLocation: xLocation,
      yLocation: yLocation,
      path: [],
      status: 'Start'
    };

    var queue = [location];

    while (queue.length > 0) {
      var currentLocation = queue.shift();
      // Explore Up
      var newLocation = exploreInDirection(grid, currentLocation, 'up', goal);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }

      // Explore Right
      var newLocation = exploreInDirection(grid, currentLocation, 'right', goal);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }

      // Explore Down
      var newLocation = exploreInDirection(grid, currentLocation, 'down', goal);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }

      // Explore Left
      var newLocation = exploreInDirection(grid, currentLocation, 'left', goal);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
      // console.log(queue[0]);
    }
    return false;
  }

  function locationStatus(grid, location, goal) {
    var gridHeight = grid.length;
    var gridWidth = grid[0].length;
    var xL = location.xLocation;
    var yL = location.yLocation;

    if (location.xLocation < 0 || location.xLocation >= gridWidth || location.yLocation < 0 || location.yLocation >= gridHeight) {

      // location is not on the grid--return false
      return 'Invalid';
    } else if (xL === goal[0] && yL === goal[1]) {
      return 'Goal';
    } else if (grid[yL][xL] !== 0) {
      // location is either an obstacle or has been visited
      return 'Blocked';
    } else {
      return 'Valid';
    }
  };

  function exploreInDirection(grid, currentLocation, direction, goal) {
    var newPath = currentLocation.path.slice();

    var newX = currentLocation.xLocation;
    var newL = currentLocation.yLocation;

    if (direction === 'up') {
      newL -= 1;
    } else if (direction === 'right') {
      newX += 1;
    } else if (direction === 'down') {
      newL += 1;
    } else if (direction === 'left') {
      newX -= 1;
    }

    newPath.push([newX, newL]);

    var newLocation = {
      xLocation: newX,
      yLocation: newL,
      path: newPath,
      status: 'Unknown'
    };

    newLocation.status = locationStatus(grid, newLocation, goal);

    if (newLocation.status === 'Valid') {
      grid[newLocation.yLocation][newLocation.xLocation] = 'Visited';
    }

    return newLocation;
  }

  return {
    state: State
  };
}();