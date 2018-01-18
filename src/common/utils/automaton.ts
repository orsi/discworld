import { PRNG } from './';

export default class Automaton {
  width: number;
  height: number;
  step = 0;
  probability = 0.7;
  birth = [6, 7, 8];
  survival = [5, 6, 7, 8];
  cells: boolean[][] = [];
  prng: PRNG;
  constructor (seed: string, width: number, height: number, options?: any) {
    this.prng = new PRNG(seed);
    this.width = width;
    this.height = height;

    // create initial automaton map
    for (let x = 0; x < this.width; x++) {
      this.cells[x] = [];
      for (let y = 0; y < this.height; y++) {
        // randomly choose alive/dead
        let alive = this.prng.random() < this.probability;
        this.cells[x][y] = alive;
      }
    }
  }
  next () {
    let nextMap: boolean[][] = [];

    for (let x = 0; x < this.width; x++) {
      nextMap[x] = [];
      for (let y = 0; y < this.height; y++) {
        let neighboursCount = this.countNeighbours(x, y);
        if (this.cells[x][y]) {
          // see if the cell survives
          nextMap[x][y] = this.survival.indexOf(neighboursCount) > -1;
        } else {
          // see if the cell comes alive
          nextMap[x][y] = this.birth.indexOf(neighboursCount) > -1;
        }
      }
    }
    this.cells = nextMap;
  }
  countNeighbours (cellX: number, cellY: number): number {
    let count = 0;
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
          let neighbourX = cellX + x;
          let neighbourY = cellY + y;
          if (x == 0 && y == 0) {
            // this is the current cell
          } else if (neighbourX < 0 || neighbourY < 0 || neighbourX >= this.width - 1 || neighbourY >= this.height - 1) {
            // Count out of bounds tiles as dead
            count--;
          } else if (this.cells[neighbourX * neighbourY]) {
            // Otherwise, a normal check of the neighbour
            count++;
          }
      }
    }
    return count;
  }
}