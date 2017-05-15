var Random = require('./random');

module.exports = class Automaton  {
  getMap () { return this.map; }
  seed () {
    // create automaton map
    for (var x = 0; x < this.width; x++) {
      this.map.push([]);
      for (var y = 0; y < this.height; y++) {
          if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
            // Borders of map should start off dead
            this.map[x][y] = false;
          } else {
            // randomly choose alive/dead
            var alive = Random.random() < this.probability;
            this.map[x][y] = alive;
          }
      }
    }
  }
  next () {
    var nextMap = [];

    //Loop over each row and column of the map
    for(var x = 0; x < this.width; x++) {
      nextMap.push([]);
      for(var y = 0; y < this.height; y++){
          var neighboursCount = this.countActiveNeighbours(x, y);

          // If the cell is alive, see if it is NOT surrounded by any of the integers in the survival list
          if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
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
  countActiveNeighbours (cellX, cellY) {
    var count = 0;
    for(var x = -1; x < 2; x++) {
      for(var y = -1; y < 2; y++) {
          var neighbourX = cellX + x;
          var neighbourY = cellY + y;
          if(x == 0 && y == 0) {
            // this is the current cell
          } else if (neighbourX < 0 || neighbourY < 0 || neighbourX >= this.width - 1 || neighbourY >= this.height - 1) {
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
  atLocation (x, y) { // 9, 1 should turn into 19
    if (x >= 0 && x < this.map.length && y >= 0 && y < this.map[0].length) {
      return this.map[x][y];
    } else
      return false;
  }
  constructor (width, height, opts) {
    this.width = width;
    this.height = height;

    this.steps = 4;
    this.probability = 0.7;
    this.birth = [6,7,8];
    this.survival = [5,6,7,8];
    this.map = [];

    this.seed();

    // do specific iterations
    for (var i = 0; i < this.steps; i++) {
      this.next();
    }
  }
}
