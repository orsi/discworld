const SystemEvents = require('./SystemEvents');
let events;
const utils = require('./Utilities');
const perlin = utils.perlin;
const random = utils.random;
const log = require('./Logger').log;

const Region = require('./world/Region');
const Area = require('./world/Area');
const Location = require('./world/Location');

const Entity = require('../shared/Entity');

var Generator = require('./world/Generator');
var RegionGenerator = require('./world/RegionGenerator');

let world;
module.exports = {
  create: function (options) {
    if (world) world.destroy();
    world = new World(options);
    world.run();
    return world;
  },
  get: function () {
    return world;
  }
};

function World (options) {
  // set default options
  options = options || {};
  this.seed = options.seed || 'Reverie';
  this.x = options.x || 1024;
  this.y = options.y || 1024;
  this.z = options.z || 256;
  this.center = {
    x: Math.round(this.x / 2),
    y: Math.round(this.y / 2),
    z: Math.round(this.z / 2)
  }

  // create world random number generator
  // from seed
  this.random = random.create(this.seed);

  // World state properties
  this.state = {
    updating: false,
    live: false,
  }

  // Intervals, timers, cycles properties
  this.accumulator = 0.0;
  this.intervals = {
    world: 1000 / 60 // 60 ticks per second
  }
  this.time = {
    createdAt: new Date(),
    lastUpdate: new Date(),
    lastCheck: new Date()
  }
  this.average = {
    update: 0
  }
  this.cycle = 0;
  this.scale = 1;


  this.regionSize = options.regionSize || 16;
  this.chunkSize = options.chunkSize || 16;

  // world data
  this.entities = [];
  this.maps = {};
  this.regions = [];

  // register events from other systems
  events = SystemEvents.register('world');
  events.on('client/connection', (client) => this.onClientConnection(client));
  events.on('client/disconnect', (client) => this.onClientDisconnect(client));
  events.on('client/message', (client, message) => this.onClientMessage(client, message));
  events.on('client/move', (client, movement) => this.onClientMove(client, movement));

  events.emit('world/update', this.get('world'));
}
World.prototype.destroy = function () {
  // remove event stuff
}

/* 
 *  World Events
 * 
 */

World.prototype.onClientConnection = function (client) {
  // create entity for client
  let entity = Entity.create('spirit');

  // add socket.id to entity for identification
  entity.clientId = client.id;

  let position = entity.get('position');
  position.x = Math.floor(Math.random() * this.x);
  position.y = Math.floor(Math.random() * this.y);
  position.z = Math.floor(Math.random() * this.z);
  
  // add to entity list
  this.entities.push(entity);

  client.send('entity', entity);
  client.send('world', this.get('regions'));
}
World.prototype.onClientDisconnect = function (client) {
  for (var i = 0; i < this.entities.length; i++) {
      var entity = this.entities[i];
      if (entity.socketId === socket.id) {
        this.entities.splice(i, 1);
        break;
      }
  }
}
World.prototype.onClientMessage = function (client, message) {
  // find entity associated with client
  let entity;
  this.entities.forEach((e) => {
    if (e.clientId === client.id) entity = e;
  });

  if (entity) {
    log.debug('received message "' + message + '" from entity with id #' + entity.id)
  }
}
World.prototype.onClientMove = function (client, movement) {
  // find entity associated with client
  let entity = this.get('entity', client.id);
  
  if (entity) {
    log.debug('received move "' + movement + '" from entity with id #' + entity.id)
  }
}


World.prototype.print = function () {
  var string = '';
  string += 'current cycle: ' + this.cycle + '\n';
  string += 'average fps: ' + this.average.update;
  return string;
}

World.prototype.stop = function () {
  this.state.live = false;
}
World.prototype.start = function () {
  this.state.live = true;
  // reset lastCheck to now so that accumulator
  // doesn't assume it should make up the time
  // since the world was last running
  this.time.lastCheck = new Date();
}
World.prototype.run = function () {
  if (this.state.live) {
    var currentTime = new Date();
    var delta = currentTime.getTime() - this.time.lastCheck.getTime();
    if (delta > this.intervals.world) delta = this.intervals.world;

    this.time.lastCheck = currentTime;

    this.accumulator += delta;

    while (this.accumulator >= this.intervals.world) {
      this.update();
      
      this.accumulator -= this.intervals.world;
    }

    log.debug('updating');
    log.debug('average ' + this.average.update);

    this.time.lastCheck = new Date();
  }
  setTimeout(this.run.bind(this), 0);
}
World.prototype.update = function () {
  this.state.updating = true;


  // calculate average time of loop
  var now = new Date();
  this.average.update = Math.floor(1000 / (now.getTime() - this.time.lastUpdate.getTime()));

  this.time.lastUpdate = now;
  this.state.updating = false;
  this.cycle++;
}
World.prototype.get = function (name, id) {
  switch (name) {
    case 'world':
      return this.getWorldData();
    case 'regions':
      return this.getRegionData();
    case 'entity':
      let entity;
      this.entities.forEach((e) => {
        if (e.clientId === id) entity = e;
      });
      return entity;
  }
}
World.prototype.getWorldData = function () {
  var world = {
    x: this.x,
    y: this.y,
    z: this.z,
    seed: this.seed,
    createdAt: this.createdAt,
    cycle: this.cycle,
    regions: this.regions.length,
  };
}
World.prototype.getRegionData = function () {
  let regions = [];

  for (var i = 0; i < this.regions; i++) {
    regions.push(regions[i]);
  }
  
  return regions;
}




// OLD STUFF
World.prototype.getWorld = function (scale) {
  var sampleSize = scale;
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
World.prototype.getRegion = function (position) {
  var halfRegion = this.regionSize / 2;
  var region = {
    chunks: []
  };


  // console.log(position.x, position.y, position.z);
  // console.log(position.x - halfChunk);

  for (var x = 0; x < this.regionSize; x++) {
    region.chunks.push([]);
    for (var y = 0; y < this.regionSize; y++) {
      region.chunks[x].push([])
      for (var z = 0; z < this.regionSize; z++) {
        var regionX = x + position.x - halfRegion;
        var regionY = y + position.y - halfRegion;
        var regionZ = z + position.z - halfRegion;
        var regionPosition = {
          x: regionX,
          y: regionY,
          z: regionZ
        }
        region.chunks[x][y][z] = this.getChunk(regionPosition);
      }
    }
  }
  // console.log(chunk);
  return region;
}
World.prototype.getChunk = function (position) {
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
World.prototype.getBlock = function (x, y, z) {
  // Gather all information for particular location in world
  var block;
  if (x >= 0 && x < this.x && y >= 0 && y < this.y && z >= 0 && z < this.z)
    block = this.maps.blocks[x][y][z];

  // console.log(block);
  return block;
}

World.prototype.entityAtLocation =  function (x, y, z) {
  for (var i = 0; i < this.entities.length; i++) {
    var entity = this.entities[i];
    if (entity.components.Position.x === x &&
        entity.components.Position.y === y &&
        entity.components.Position.z === z) {
          return entity;
      }
  }
}
World.prototype.getSurface = function (x, y) {
  var z = 0;
  for (var i = this.z; i > 0; i--) {
    if (this.maps.earth[x][y][i] > 0) {
      z = i;
      break;
    }
  }
  return z;
}

var BLOCKS = require('./world/BlockTypes');

World.prototype.generate = function (options) {
  options = options || {};
  this.regionsMin = options.regionsMin || 10;
  this.regionsMax = options.regionsMax || 27;
  this.x = options.x || 1024;
  this.y = options.y || 1024;
  this.z = options.z || 256;

  this.regions = RegionGenerator.create(this, this.regionsMin, this.regionsMax);
  
  this.createdAt = Date.now();

  events.emit('world', this.regions);
  
  return this;
}

World.prototype.generateBlocks = function () {
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

