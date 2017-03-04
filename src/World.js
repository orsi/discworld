// private properties

// private functions
function doCellAutomataStep(oldMap, birth, survival) {
  let newMap = [];
  for(let i = 0; i < oldMap.length; i++) {
    newMap.push([]);
    for (let j = 0; j < oldMap[i].length; j++) {
      newMap[i].push(oldMap[i][j]);
    }
  }
  //Loop over each row and column of the map
  for(let x= 0; x < oldMap.length; x++) {
      for(let y = 0; y < oldMap[0].length; y++){
          let neighboursCount = countAliveNeighbours(oldMap, x, y);

          // If the cell is alive, see if it is NOT surrounded by any of the integers in the survival list
          if(oldMap[x][y]) {
              if (!(survival.indexOf(neighboursCount) > -1)){
                  newMap[x][y] = false;
              }
          } else {  // if the cell is dead, see if it is surrounded by any of the integers in the birth list
              if (birth.indexOf(neighboursCount) > -1) {
                  newMap[x][y] = true;
              }
          }
      }
  }
  return newMap;
}
function countAliveNeighbours(map, x, y) {
  let count = 0;
    for(let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){
            let neighbourX = x + i;
            let neighbourY = y + j;
            //If we're looking at the middle point
            if(i == 0 && j == 0){
                //Do nothing, we don't want to add ourselves in!
            }
            //In case the index we're looking at it off the edge of the map
            else if(neighbourX < 0 || neighbourY < 0 || neighbourX >= map.length || neighbourY >= map[0].length){
                count = count + 1;
            }
            //Otherwise, a normal check of the neighbour
            else if(map[neighbourX][neighbourY]) {
                count = count + 1;
            }
        }
    }
    return count;
}

class World {
  getLocation (x, y) {
    return this.map[x][y];
  }

  createTerrain (steps, alivePercent, birth, survival) {

    // create cell automata map
    let cellMap = [];
    for (let i = 0; i < this.x; i++) {
      cellMap.push([]);
      for (let j = 0; j < this.y; j++) {
          let alive = Math.random() < alivePercent;
          cellMap[i].push(alive);
      }
    }

    for (let i = 0; i < steps; i++) {
      cellMap = doCellAutomataStep(cellMap, birth, survival);
    }

    return cellMap;
  }

  constructor(opts) {
    // check for options
    opts = opts || {};
    opts.x = opts.hasOwnProperty('x') ? opts.x : 150;
    opts.y = opts.hasOwnProperty('y') ? opts.y : 150;
    opts.steps = opts.hasOwnProperty('steps') ? opts.steps : 15;
    opts.alivePercent = opts.hasOwnProperty('alivePercent') ? opts.alivePercent : 0.4;
    opts.birth = opts.hasOwnProperty('birth') ? opts.birth : [6,7,8];
    opts.survival = opts.hasOwnProperty('survival') ? opts.survival : [3,4,5,6,7,8];

    // set properties
    this.x = opts.x;
    this.y = opts.y;
    this.steps = opts.steps;
    this.alivePercent = opts.alivePercent;
    this.birth = opts.birth;
    this.survival = opts.survival;

    // create 2d array of x by y
    this.map = [];
    for (let i = 0; i < this.x; i++) {
      this.map.push([]);
      for (let j = 0; j < this.y; j++) {
          this.map[i].push(0);
      }
    }
    this.cellMap = this.createTerrain(this.steps, this.alivePercent, this.birth, this.survival);
  }
}
module.exports = World;
