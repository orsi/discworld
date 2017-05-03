var Entities = require('./entities/Entities');
var Generator = require('../utilities/Generator');
var utils = require('../utilities/Utilities');
var perlin = utils.perlin;

module.exports = WorldObject;
function WorldObject (seed) {
      this.seed = seed;
      this.createdAt = new Date();
      this.currentTime = this.createdAt;
      this.x = 100;
      this.y = 100;
      this.z = 15;
      this.chunkSize = 16;
      this.regions = 10;
      this.entities = [];
      this.maps = {};

      /* generate world! */
      var options = {
        x: this.x,
        y: this.y,
        z: this.z,
        regions: this.regions,
        seed: this.seed
      }
      this.maps.earth = Generator.generate('earth', options);
      this.maps.wind = Generator.generate('wind', options);
      this.maps.water = Generator.generate('water', options);
      this.maps.fire = Generator.generate('fire', options);
      this.maps.blocks = this.generateBlocks();
}


WorldObject.prototype.registerEvents = function (events) {
    events.on('socket:connection', (socket) => {
          var entity = Entities.createPlayer();
          entity.socketId = socket.id;
          this.entities.push(entity);

          entity.components.Position.x = 14;
          entity.components.Position.y = 26;
          entity.components.Position.z = 7;

          events.emit('world:init', entity, this.getChunk(entity.components.Position), this.entities);
    });
  }

WorldObject.prototype.getChunk = function (position) {
  var halfChunk = this.chunkSize / 2;
  var chunk = [];


    console.log(position.x, position.y, position.z);
    console.log(position.x - halfChunk);

  for (var x = 0; x < this.chunkSize; x++) {
    chunk.push([]);
    for (var y = 0; y < this.chunkSize; y++) {
      chunk[x].push([])
      for (var z = 0; z < this.z; z++) {
        var blockX = x + position.x - halfChunk;
        var blockY = y + position.y - halfChunk;
        chunk[x][y][z] = this.getBlock(blockX, blockY, z);
      }
    }
  }
  // console.dir(chunk);
  return chunk;
}

WorldObject.prototype.getBlock = function (x, y, z) {
  // Gather all information for particular location in world
  var block;
  if (x >= 0 && x < this.x && y >= 0 && y < this.y && z >= 0 && z < this.z)
    block = this.maps.blocks[x][y][z];

  // console.log(block);
  return block;
}

WorldObject.prototype.entityAtLocation =  function (x, y, z) {
  for (var i = 0; i < this.entities.length; i++) {
    var entity = this.entities[i];
    if (entity.components.Position.x === x &&
        entity.components.Position.y === y &&
        entity.components.Position.z === z) {
          return entity;
      }
  }
}

var BLOCKS = {
  GRASS: 1,
  SOIL: 2,
  ROCK: 3,
  WATER: 4,
  FIRE: 5,
  GOLD: 6
}

WorldObject.prototype.generateBlocks = function () {
    var blocks = [];
    var earth = this.maps.earth;
    var wind = this.maps.wind;
    var water = this.maps.water;
    var fire = this.maps.fire;

    for (var x = 0; x < this.x; x++) {
      blocks.push([]);
      for (var y = 0; y < this.y; y++) {
        blocks[x].push([]);
        for (var z = 0; z < this.z; z++) {
          blocks[x][y].push([]);

          if (earth[x][y][z] !== null) {
            var block;

            /* determine block from combination of wind, water, and fire */
            if (wind[x][y][z] === 1 && water[x][y][z] === 1 && fire[x][y][z] === 1) block = BLOCKS.GRASS;
            else if (wind[x][y][z] === 1 && water[x][y][z] !== 1 && fire[x][y][z] === 1) block = BLOCKS.SOIL;
            else if (wind[x][y][z] === 1 && water[x][y][z] !== 1 && fire[x][y][z] !== 1) block = BLOCKS.ROCK;
            else if (wind[x][y][z] !== 1 && water[x][y][z] === 1 && fire[x][y][z] === 1) block = BLOCKS.WATER;
            else if (wind[x][y][z] !== 1 && water[x][y][z] !== 1 && fire[x][y][z] === 1) block = BLOCKS.FIRE;
            else if (wind[x][y][z] !== 1 && water[x][y][z] !== 1 && fire[x][y][z] !== 1) block = BLOCKS.GOLD;
            else block = null;

            blocks[x][y][z] = block;
          }
          // debug
          // if (x % 10 === 0 && y % 10 === 0) console.log(blocks[x][y][z]);
        }
      }
    }

    return blocks;
}
