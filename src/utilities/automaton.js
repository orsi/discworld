var Random = require('./random');

module.exports = {
  create: function (x, y, options) {
    return new Automaton(x, y, options);
  }
}

function Automaton (x, y, options) {
  this.x = x || 50;
  this.y = y || 50;

  options = options || {};
  this.steps = options.steps || 4;
  this.probability = options.probability || 0.7;
  this.birth = options.birth || [6,7,8];
  this.survival = options.survival || [5,6,7,8];
  this.map = [];

  // create automaton map
  for (var x = 0; x < this.x; x++) {
    this.map.push([]);
    for (var y = 0; y < this.y; y++) {
      // randomly choose alive/dead
      var alive = Random.random() < this.probability;
      this.map[x][y] = alive;
    }
  }

  // do iterations
  for (var i = 0; i < this.steps; i++) {
    this.next();
  }

  return this.map;
}

Automaton.prototype.next = function () {
  var nextMap = [];

  //Loop over each row and column of the map
  for(var x = 0; x < this.x; x++) {
    nextMap.push([]);
    for(var y = 0; y < this.y; y++){
        var neighboursCount = this.countNeighbours(x, y);

        // If the cell is alive, see if it is NOT surrounded by any of the integers in the survival list
        if (x === 0 || y === 0 || x === this.x - 1 || y === this.y - 1) {
          // do nothing, keep eadge tiles dead
          nextMap[x][y] = false;
        } else if (this.map[x][y]) {
            if (!(this.survival.indexOf(neighboursCount) > -1)){
              nextMap[x][y] = false;
            } else {
              nextMap[x][y] = true;
            }
        } else {  // if the cell is dead, see if it is surrounded by any of the integers in the birth list
            if (this.birth.indexOf(neighboursCount) > -1) {
              nextMap[x][y] = true;
            } else {
              nextMap[x][y] = false;
            }
        }
    }
  }
  this.map = nextMap;
}
Automaton.prototype.countNeighbours = function (cellX, cellY) {
  var count = 0;
  for(var x = -1; x < 2; x++) {
    for(var y = -1; y < 2; y++) {
        var neighbourX = cellX + x;
        var neighbourY = cellY + y;
        if(x == 0 && y == 0) {
          // this is the current cell
        } else if (neighbourX < 0 || neighbourY < 0 || neighbourX >= this.x - 1 || neighbourY >= this.y - 1) {
          // Count out of bounds tiles as dead
          count--;
        } else if (this.map[neighbourX][neighbourY]) {
          //Otherwise, a normal check of the neighbour
          count++;
        }
    }
  }

  return count;
}