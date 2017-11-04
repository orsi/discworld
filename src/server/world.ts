import { Reverie } from './reverie';
import { EventManager } from '../common/eventManager';
import { Logger } from './logger';
import * as EntityEvents from '../common/ecs/entityEvents';
import { EntitySystem } from '../common/ecs/entitySystem';
import { Entity } from '../common/ecs/entity';
import * as Components from '../common/ecs/component';
import * as WorldEvents from '../common/world/worldEvents';
import { WorldModel } from '../common/world/models/worldModel';
// utils
import { Automaton } from '../common/utils/automaton';
import { perlin } from '../common/utils/perlin';
import { PRNG } from '../common/utils/prng';
import { TimerManager } from '../common/utils/timerManager';

export class World {
  events: EventManager;
  entitySystem: EntitySystem;
  timers: TimerManager;
  model: WorldModel;
  automaton: Automaton;
  prng: PRNG;

  // Update properties
  private startTime = new Date();
  private lastUpdateTime = this.startTime.getTime();
  private lastUpdatedEventTime = this.startTime.getTime();
  private pauseStartTime = this.startTime.getTime();
  private worldTime = this.startTime.getTime();
  private cycles = 0;
  private isUpdating = false;
  private isPaused = false;

  constructor (events: EventManager) {
    this.events = events;
    this.entitySystem = new EntitySystem();
    this.timers = new TimerManager();
  }

  /**
   * Creates a new entity for the new
   * connection on the network.
   */
  createEntity () {
    let entity = this.entitySystem.create();
    if (this.model) {
      let mapPosition = this.getRandomLandPosition();
      let entityPosition = entity.addComponent<Components.PositionComponent>('position');
      if (entityPosition && mapPosition) {
        entityPosition.x = mapPosition.x;
        entityPosition.y = mapPosition.y;
      }
    }
    this.events.emit<EntityEvents.Create>('entity', new EntityEvents.Create(entity));
    return entity;
  }

  /**
   * Parses the message sent by a client
   * to the world.
   */
  messageEntity (entityId: string, message: string) {
    if (message === 'generate world') {
      this.create();
    }
    if (message === 'get world') {

    }
    if (message === 'destroy world') {
      this.destroy();
    }
  }

  /**
   * Moves an entity in the world.
   */
  moveEntity (entityId: string, direction: string) {
    console.log('new entity moved', entityId);
    let entity = this.entitySystem.getEntityBySerial(entityId);
    if (entity) {
      let position = entity.getComponent<Components.PositionComponent>('position');
      if (position) {
        if (direction.indexOf('n') > -1) position.y -= 1;
        if (direction.indexOf('s') > -1) position.y += 1;
        if (direction.indexOf('w') > -1) position.x -= 1;
        if (direction.indexOf('e') > -1) position.x += 1;
        this.events.emit<EntityEvents.Update>('entity/update', new EntityEvents.Update(entity));
      }
    }
  }
  removeEntity (entityId: string) {}
  lookEntity (entityId: string) {}
  interactEntity (entityId: string) {}
  /**
   * Returns the amount of simulated time that has passed.
   */
  getWorldTime() {
    return this.worldTime;
  }
  /**
   * Pauses the current world from updates.
   */
  pause() {
    this.pauseStartTime = new Date().getTime();
    this.isPaused = true;
  }
  /**
   * Ensures the lastUpdate time is correct
   * if the world was previously paused. This prevents
   * simulating the time difference from last update.
   */
  run () {
    if (this.isPaused) {
      this.lastUpdateTime = new Date().getTime();
    }
    this.isPaused = false;
  }
  /**
   * Main update method for world simulation.
   */
  update (delta: number) {
    this.isUpdating = true;
    const now = new Date();
    this.lastUpdateTime = now.getTime();
    this.worldTime += delta;
    this.cycles++;

    // main update
    this.timers.process(delta);

    this.isUpdating = false;
  }
  create (seed?: string) {
    this.destroy();
    this.model = new WorldModel(seed);
    this.prng = new PRNG(this.model.seed);
    this.model.width = this.prng.range(50, 250);
    this.model.height = this.prng.range(50, 250);
    this.automaton = new Automaton(this.model.width, this.model.height, {
      seed: this.model.seed,
      step: 2
    });
    // hack for now
    this.model.map = this.automaton.getMap();
    //  update event
    this.timers.createTimer(1000, () => {
      // send world update every ~1s
      this.events.emit<WorldEvents.Update>('world/update', new WorldEvents.Update(this.model));
      this.lastUpdatedEventTime = new Date().getTime();
    });

    // update all entites with position
    this.entitySystem.getAllEntities().forEach(entity => {
      let mapPosition = this.getRandomLandPosition();
      let entityPosition = entity.addComponent<Components.PositionComponent>('position');
      if (entityPosition && mapPosition) {
        entityPosition.x = mapPosition.x;
        entityPosition.y = mapPosition.y;
      }
      this.events.emit<EntityEvents.Update>('entity/update', new EntityEvents.Update(entity));
    });
    this.events.emit<WorldEvents.Create>('world', new WorldEvents.Create(this.model));
  }
  /**
   * Cleanup process for removing the world.
   */
  destroy () {
    this.timers.removeAll();
    this.events.emit<WorldEvents.Destroy>('world/destroy');
  }
  /**
   * Prints out an overview of the current world state.
   */
  print () {
    return JSON.stringify(this);
  }
  getRandomLandPosition () {
    for (let x = 0; x < this.model.width; x++) {
      for (let y = 0; y < this.model.height; y++) {
        if (this.model.map[x][y]) {
          return {
            x: x,
            y: y
          };
        }
      }
    }
  }
}

// class UniverseComponent extends Component {
//   public x: number;
//   public y: number;
//   public z: number;
// }
// Universe.prototype.onClientMessage = function (client, message) {
//   // find entity associated with client
//   let entity = client.entity;

//   if (entity) {
//     log.debug('received message "' + message + '" from entity with id #' + entity.id)
//   }
// }
// Universe.prototype.onClientMove = function (client, movement) {
//   // find entity associated with client
//   let entity = client.entity;

//   if (entity && entity['position']) {
//     log.debug('received move "' + movement.dir + '" from entity with id #' + entity.id);
//     switch (movement.dir) {
//       case 'north':
//         if (entity['position'].y > 0)
//           entity['position'].y--
//         break;
//       case 'northEast':
//         if (entity['position'].y > 0)
//           entity['position'].y--;
//         if (entity['position'].x < this.x)
//           entity['position'].x++;
//         break;
//       case 'east':
//         if (entity['position'].x < this.x)
//           entity['position'].x++;
//         break;
//       case 'southEast':
//         if (entity['position'].y < this.y)
//           entity['position'].y++;
//         if (entity['position'].x < this.x)
//           entity['position'].x++;
//         break;
//       case 'south':
//         if (entity['position'].y < this.y)
//           entity['position'].y++;
//         break;
//       case 'southWest':
//         if (entity['position'].y < this.y)
//           entity['position'].y++;
//         if (entity['position'].x > 0)
//           entity['position'].x--;
//         break;
//       case 'west':
//         if (entity['position'].x > 0)
//           entity['position'].x--;
//         break;
//       case 'northWest':
//         if (entity['position'].y > 0)
//           entity['position'].y--;
//         if (entity['position'].x > 0)
//           entity['position'].x--;
//         break;
//     }

//     client.send('player/update', entity);
//   }
// }
// Universe.prototype.onPlayerLevitate = function (client, levitate) {
//   // find entity associated with client
//   let entity = client.entity;

//   if (entity.type === 'spirit') {
//     log.debug('received levitate "' + levitate + '" from entity with id #' + entity.id)
//   }
// }


// Universe.prototype.stop = function () {
//   this.state.live = false;
// }
// Universe.prototype.start = function () {
//   this.state.live = true;
//   // reset lastCheck to now so that accumulator
//   // doesn't assume it should make up the time
//   // since the world was last running
//   this.time.lastCheck = new Date();
// }
// Universe.prototype.get = function (name, id) {
//   switch (name) {
//     case 'world':
//       return this.getWorldData();
//     case 'regions':
//       return this.getRegionData();
//     case 'entity':
//       let entity;
//       this.entities.forEach((e) => {
//         if (e.clientId === id) entity = e;
//       });
//       return entity;
//   }
// }
// Universe.prototype.getWorldData = function () {
//   var world = {
//     x: this.x,
//     y: this.y,
//     z: this.z,
//     seed: this.seed,
//     createdAt: this.createdAt,
//     cycle: this.cycle,
//     regions: this.regions.length,
//   };
//   return world;
// }
// Universe.prototype.getRegionData = function () {
//   let regions = [];

//   for (var i = 0; i < this.regions; i++) {
//     regions.push(regions[i]);
//   }

//   return regions;
// }

// Universe.prototype.generateWorldMap = function () {
//   let sample = 32 / 2;
//   perlin.seed(this.random.next());
//   let temp = this.maps.temperature = [];
//   for (let x = 0; x < 32; x++) {
//     temp.push([]);
//     for (let y = 0; y < 32; y++) {
//       temp[x].push([]);
//       for (let z = 0; z < 32; z++) {
//         value = perlin.noise3d(x / sample, y / sample, z);
//         value = value * 50;
//         temp[x][y][z] = value;
//       }
//     }
//   }
//   this.maps.cells = [];
//   for (let i = 0; i < 5; i++) {
//     let cells = new utils.automaton(32, 32, this.random);
//     let cz = Math.floor(this.random.range(0, 32));
//     let map = {
//       z: cz,
//       values: cells
//     }
//     this.maps.cells.push(map);
//   }
//   events.emit('network/broadcast', 'debug/maps', this.maps);
// }


// // OLD STUFF
// Universe.prototype.getWorld = function (scale) {
//   var sampleSize = scale;
//   var world = {
//     x: this.x / sampleSize,
//     y: this.y / sampleSize,
//     z: this.z / sampleSize,
//     center: {
//       x: Math.floor(this.x / sampleSize / 2),
//       y: Math.floor(this.y / sampleSize / 2),
//       z: Math.floor(this.z / sampleSize / 2)
//     },
//     sample: sampleSize,
//     regions: [],
//   };
//   // console.log(position.x, position.y, position.z);
//   // console.log(position.x - halfworld);

//   for (var x = 0; x < this.x / sampleSize; x++) {
//     world.regions.push([]);
//     for (var y = 0; y < this.y / sampleSize; y++) {
//       world.regions[x].push([])
//       for (var z = 0; z < this.z / sampleSize; z++) {
//         world.regions[x][y][z] = {};
//         world.regions[x][y][z].position = {
//             x: x,
//             y: y,
//             z: z
//         };
//         world.regions[x][y][z].block = this.getBlock(x * sampleSize, y * sampleSize, z * sampleSize);
//       }
//     }
//   }
//   // console.log(world);
//   return world;
// }
// Universe.prototype.getRegion = function (position) {
//   var halfRegion = this.regionSize / 2;
//   var region = {
//     chunks: []
//   };


//   // console.log(position.x, position.y, position.z);
//   // console.log(position.x - halfChunk);

//   for (var x = 0; x < this.regionSize; x++) {
//     region.chunks.push([]);
//     for (var y = 0; y < this.regionSize; y++) {
//       region.chunks[x].push([])
//       for (var z = 0; z < this.regionSize; z++) {
//         var regionX = x + position.x - halfRegion;
//         var regionY = y + position.y - halfRegion;
//         var regionZ = z + position.z - halfRegion;
//         var regionPosition = {
//           x: regionX,
//           y: regionY,
//           z: regionZ
//         }
//         region.chunks[x][y][z] = this.getChunk(regionPosition);
//       }
//     }
//   }
//   // console.log(chunk);
//   return region;
// }
// Universe.prototype.getChunk = function (position) {
//   var halfChunk = this.chunkSize / 2;
//   var chunk = [];


//   // console.log(position.x, position.y, position.z);
//   // console.log(position.x - halfChunk);

//   for (var x = 0; x < this.chunkSize; x++) {
//     chunk.push([]);
//     for (var y = 0; y < this.chunkSize; y++) {
//       chunk[x].push([])
//       for (var z = 0; z < this.chunkSize; z++) {
//         var blockX = x + position.x - halfChunk;
//         var blockY = y + position.y - halfChunk;
//         var blockZ = z + position.z - halfChunk;
//         chunk[x][y][z] = this.getBlock(blockX, blockY, blockZ);
//       }
//     }
//   }
//   // console.log(chunk);
//   return chunk;
// }
// Universe.prototype.getBlock = function (x, y, z) {
//   // Gather all information for particular location in world
//   var block;
//   if (x >= 0 && x < this.x && y >= 0 && y < this.y && z >= 0 && z < this.z)
//     block = this.maps.blocks[x][y][z];

//   // console.log(block);
//   return block;
// }

// Universe.prototype.entityAtLocation =  function (x, y, z) {
//   for (var i = 0; i < this.entities.length; i++) {
//     var entity = this.entities[i];
//     if (entity.components.Position.x === x &&
//         entity.components.Position.y === y &&
//         entity.components.Position.z === z) {
//           return entity;
//       }
//   }
// }
// Universe.prototype.getSurface = function (x, y) {
//   var z = 0;
//   for (var i = this.z; i > 0; i--) {
//     if (this.maps.earth[x][y][i] > 0) {
//       z = i;
//       break;
//     }
//   }
//   return z;
// }

// var BLOCKS = require('./world/BlockTypes');

// Universe.prototype.generate = function (options) {
//   options = options || {};
//   this.regionsMin = options.regionsMin || 10;
//   this.regionsMax = options.regionsMax || 27;
//   this.x = options.x || 1024;
//   this.y = options.y || 1024;
//   this.z = options.z || 256;

//   this.regions = RegionGenerator.create(this, this.regionsMin, this.regionsMax);

//   this.createdAt = Date.now();

//   events.emit('world', this.regions);

//   return this;
// }

// Universe.prototype.generateBlocks = function () {
//     var blocks = [];
//     var earth = this.maps.earth;
//     var wind = this.maps.wind;
//     var water = this.maps.water;
//     var fire = this.maps.fire;

//     for (var x = 0; x < this.x; x++) {
//       blocks.push([]);
//       for (var y = 0; y < this.y; y++) {
//         blocks[x].push([]);
//         for (var z = 0; z < this.z; z++) {

//           // debug
//           // if (x % 10 === 0) console.log(earth[x][y][z]);

//           var block = null;
//           if (earth[x][y][z] > 0) {
//             /* determine block from combination of wind, water, and fire */
//             // if (wind[x][y][z] === 1 && water[x][y][z] === 1 && fire[x][y][z] === 1) block = BLOCKS.GRASS;
//             // else if (wind[x][y][z] === 1 && water[x][y][z] !== 1 && fire[x][y][z] === 1) block = BLOCKS.SOIL;
//             // else if (wind[x][y][z] === 1 && water[x][y][z] !== 1 && fire[x][y][z] !== 1) block = BLOCKS.ROCK;
//             // else if (wind[x][y][z] !== 1 && water[x][y][z] === 1 && fire[x][y][z] === 1) block = BLOCKS.WATER;
//             // else if (wind[x][y][z] !== 1 && water[x][y][z] !== 1 && fire[x][y][z] === 1) block = BLOCKS.FIRE;
//             // else if (wind[x][y][z] !== 1 && water[x][y][z] !== 1 && fire[x][y][z] !== 1) block = BLOCKS.GOLD;
//             // else block = BLOCKS.ROCK;

//             if (z > this.z * 0.1 && z < this.z * 0.9 && z == this.getSurface(x,y)) block = BLOCKS.GRASS;
//             else if (earth[x][y][z] < 0.4) block = BLOCKS.SOIL;
//             else if (earth[x][y][z] < 0.6) block = BLOCKS.ROCK;
//             else if (earth[x][y][z] < 0.8) block = BLOCKS.METAL;
//             else block = BLOCKS.CORE;
//           }
//           blocks[x][y][z] = block;
//           // debug
//           // if (blocks[x][y][z] !== null) console.log(blocks[x][y][z]);
//         }
//       }
//     }

//     return blocks;
// }
