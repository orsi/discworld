const Random = require('./Random');

class Automata {
  constructor (opts) {
    // defaults
    this.options = {
      width: 50,
      height: 50,
      steps: 0,
      probability: 0.7,
      birth: [6,7,8],
      survival: [5,6,7,8]
    }
    this.options.override(opts);

    this._width = this.options.width;
    this._height = this.options.height;
    this._steps = this.options.steps;
    this._probability = this.options.probability;
    this._birth = this.options.birth;
    this._survival = this.options.survival;

    let self = this;
    this._grid = [].create2d(this.options.width, this.options.height, function (x, y) {
      if (x === 0 || y === 0 || x === self._width - 1 || y === self._height - 1) {
        // Borders of map should start off dead
        return false;
      } else {
        // randomly choose alive/dead
        let alive = Random.random() < self._probability;
        return alive;
      }
    });

    // run through default steps
    for (let i = 0; i < this._steps; i++) {
      this.next();
    }
  }
  next() {
    let nextGrid = [].clone(this._grid);

    //Loop over each row and column of the map
    for(let x= 0; x < this._width; x++) {
        for(let y = 0; y < this._height; y++){
            let neighboursCount = this.countActiveNeighbours(x, y);
            // If the cell is alive, see if it is NOT surrounded by any of the integers in the survival list
            if (x === 0 || y === 0 || x === this._width - 1 || y === this._height - 1) {
              // do nothing, keep eadge tiles dead
            } else if (this._grid[x][y]) {
                if (!(this._survival.indexOf(neighboursCount) > -1)){
                    nextGrid[x][y] = false;
                }
            } else {  // if the cell is dead, see if it is surrounded by any of the integers in the birth list
                if (this._birth.indexOf(neighboursCount) > -1) {
                    nextGrid[x][y] = true;
                }
            }
        }
    }

    this._grid = nextGrid;
    return this;
  }
  countActiveNeighbours(cellX, cellY) {
    let count = 0;
    for(let x = -1; x < 2; x++){
        for(let y = -1; y < 2; y++){
            let neighbourX = cellX + x;
            let neighbourY = cellY + y;
            if(x == 0 && y == 0){
              // this is the current cell
            } else if (neighbourX < 0 || neighbourY < 0 || neighbourX >= this._width || neighbourY >= this._height) {
              // Count out of bounds tiles as dead
              count--;
            } else if(this._grid[neighbourX][neighbourY]) {
              //Otherwise, a normal check of the neighbour
              count++;
            }
        }
    }
    return count;
  }
}

module.exports = Automata;
