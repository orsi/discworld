var EventChannel = require('../EventChannel');
var Entities = require('./entities/Entities');
var utils = require('../utilities/Utilities');
var perlin = utils.perlin;
var random = utils.random;
var Generator = require('./Generator');

module.exports = {
  create: function (seed) {
    var world = new WorldObject(seed);
    world.registerEvents(EventChannel);
    return world;
  },
  WorldObject: WorldObject
};

function WorldObject (seed) {
      this.seed = seed;
      this.createdAt = new Date();
      this.currentTime = this.createdAt;
      this.x = 50;
      this.y = 50;
      this.z = 100;
      this.centerX = Math.round(this.x / 2);
      this.centerY = Math.round(this.y / 2);
      this.centerZ = Math.round(this.z / 2);
      this.chunkSize = 16;

      // seed random number generator
      random.seed(seed);

      // power of 3 to be explicit about how a 3d grid would use this
      this.regions = Math.pow(3, 3);

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

      this.print();
}
WorldObject.prototype.print = function () {
  console.log(`world -- x: ${this.x}, y: ${this.y}, z: ${this.z}`);
  console.log(`world -- cx: ${this.centerX}, cy: ${this.centerY}, cz: ${this.centerZ}`);
  console.log(`world -- seed: ${this.seed}`);
  console.log(`world -- createdAt: ${this.createdAt}`);
  console.log(`world -- regions: ${this.regions}`);
}
WorldObject.prototype.registerEvents = function (events) {
    events.on('socket:connection', (socket) => {
          var character = Entities.createPlayer();
          character.socketId = socket.id;
          this.entities.push(character);

          character.components.Position.x = Math.floor(Math.random() * this.x);
          character.components.Position.y = Math.floor(Math.random() * this.y);
          character.components.Position.z = this.getSurface(character.components.Position.x, character.components.Position.y);

          events.emit('world:init', character, this.getWorld(character.components.Position), this.entities);
    });
    events.on('socket:disconnect', (socket) => {
      for (var i = 0; i < this.entities.length; i++) {
          var entity = this.entities[i];
          if (entity.socketId === socket.id) {
            this.entities.splice(i, 1);
            break;
          }
      }
    });
  }
WorldObject.prototype.getWorld = function () {
  var sampleSize = 1;
  var world = {
    x: this.x / sampleSize,
    y: this.y / sampleSize,
    z: this.z / sampleSize,
    center: {
      x: Math.floor(this.x / sampleSize / 2),
      y: Math.floor(this.y / sampleSize / 2),
      z: Math.floor(this.z / sampleSize / 2)
    },
    sample: sampleSize,
    regions: [],
  };
  // console.log(position.x, position.y, position.z);
  // console.log(position.x - halfworld);

  for (var x = 0; x < this.x / sampleSize; x++) {
    world.regions.push([]);
    for (var y = 0; y < this.y / sampleSize; y++) {
      world.regions[x].push([])
      for (var z = 0; z < this.z / sampleSize; z++) {
        world.regions[x][y][z] = {};
        world.regions[x][y][z].position = {
            x: x,
            y: y,
            z: z
        };
        world.regions[x][y][z].block = this.getBlock(x * sampleSize, y * sampleSize, z * sampleSize);
      }
    }
  }
  // console.log(world);
  return world;
}
WorldObject.prototype.getChunk = function (position) {
  var halfChunk = this.chunkSize / 2;
  var chunk = [];


  // console.log(position.x, position.y, position.z);
  // console.log(position.x - halfChunk);

  for (var x = 0; x < this.chunkSize; x++) {
    chunk.push([]);
    for (var y = 0; y < this.chunkSize; y++) {
      chunk[x].push([])
      for (var z = 0; z < this.chunkSize; z++) {
        var blockX = x + position.x - halfChunk;
        var blockY = y + position.y - halfChunk;
        var blockZ = z + position.z - halfChunk;
        chunk[x][y][z] = this.getBlock(blockX, blockY, blockZ);
      }
    }
  }
  // console.log(chunk);
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
WorldObject.prototype.getSurface = function (x, y) {
  var z = 0;
  for (var i = this.z; i > 0; i--) {
    if (this.maps.earth[x][y][i] > 0) {
      z = i;
      break;
    }
  }
  return z;
}

var BLOCKS = require('./BlockTypes');

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

          // debug
          // if (x % 10 === 0) console.log(earth[x][y][z]);

          var block = null;
          if (earth[x][y][z] > 0) {
            /* determine block from combination of wind, water, and fire */
            // if (wind[x][y][z] === 1 && water[x][y][z] === 1 && fire[x][y][z] === 1) block = BLOCKS.GRASS;
            // else if (wind[x][y][z] === 1 && water[x][y][z] !== 1 && fire[x][y][z] === 1) block = BLOCKS.SOIL;
            // else if (wind[x][y][z] === 1 && water[x][y][z] !== 1 && fire[x][y][z] !== 1) block = BLOCKS.ROCK;
            // else if (wind[x][y][z] !== 1 && water[x][y][z] === 1 && fire[x][y][z] === 1) block = BLOCKS.WATER;
            // else if (wind[x][y][z] !== 1 && water[x][y][z] !== 1 && fire[x][y][z] === 1) block = BLOCKS.FIRE;
            // else if (wind[x][y][z] !== 1 && water[x][y][z] !== 1 && fire[x][y][z] !== 1) block = BLOCKS.GOLD;
            // else block = BLOCKS.ROCK;

            if (z > this.z * 0.1 && z < this.z * 0.9 && z == this.getSurface(x,y)) block = BLOCKS.GRASS;
            else if (earth[x][y][z] < 0.4) block = BLOCKS.SOIL;
            else if (earth[x][y][z] < 0.6) block = BLOCKS.ROCK;
            else if (earth[x][y][z] < 0.8) block = BLOCKS.METAL;
            else block = BLOCKS.CORE;
          }
          blocks[x][y][z] = block;
          // debug
          // if (blocks[x][y][z] !== null) console.log(blocks[x][y][z]);
        }
      }
    }

    return blocks;
}

