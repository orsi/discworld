import prng from './prng';
export default class Automaton {
  private seed: number | string = new Date().getTime();
  private step: number = 0;
  private probability: number = 0.7;
  private birth: Array<number> = [6, 7, 8];
  private survival: Array<number> = [5, 6, 7, 8];
  private map: Array<Array<boolean>> = [];
  private random: prng;
  constructor (private x: number = 50, private y: number = 50, options?: AutomatonOptions) {

    if (options) {
      if (options.seed) this.seed = options.seed;
      if (options.step) this.step = options.step;
      if (options.probability) this.probability = options.probability;
      if (options.birth) this.birth = options.birth;
      if (options.survival) this.survival = options.survival;
    }

    this.random = new prng(this.seed);

    // create automaton map
    for (let x = 0; x < this.x; x++) {
      this.map.push([]);
      for (let y = 0; y < this.y; y++) {
        // randomly choose alive/dead
        let alive = this.random.next() < this.probability;
        this.map[x][y] = alive;
      }
    }

    // do initial iterations
    for (let i = 0; i < this.step; i++) {
      this.next();
    }
  }
  next () {
    let nextMap: Array<Array<boolean>> = [];

    // Loop over each row and column of the map
    for (let x = 0; x < this.x; x++) {
      nextMap.push([]);
      for (let y = 0; y < this.y; y++) {
          let neighboursCount = this.countNeighbours(x, y);

          // If the cell is alive, see if it is NOT surrounded by any of the integers in the survival list
          if (x === 0 || y === 0 || x === this.x - 1 || y === this.y - 1) {
            // do nothing, keep eadge tiles dead
            nextMap[x][y] = false;
          } else if (this.map[x][y]) {
              if (!(this.survival.indexOf(neighboursCount) > -1)) {
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

  countNeighbours (cellX: number, cellY: number): number {
    let count = 0;
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
          let neighbourX = cellX + x;
          let neighbourY = cellY + y;
          if (x == 0 && y == 0) {
            // this is the current cell
          } else if (neighbourX < 0 || neighbourY < 0 || neighbourX >= this.x - 1 || neighbourY >= this.y - 1) {
            // Count out of bounds tiles as dead
            count--;
          } else if (this.map[neighbourX][neighbourY]) {
            // Otherwise, a normal check of the neighbour
            count++;
          }
      }
    }
    return count;
  }
}


interface AutomatonOptions {
  seed?: number | string;
  step?: number;
  probability?: number;
  birth?: Array<number>;
  survival?: Array<number>;
}