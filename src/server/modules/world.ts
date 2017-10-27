import { Reverie } from '../reverie';
import { EventManager } from '../core/eventManager';
import { Logger } from './logger';
import { Client } from './client';
import * as Packets from './network/packets';
import { EntitySystem } from '../core/entities/entitySystem';
import { Entity } from '../core/entities/entity';
import { WorldModel } from './models/worldModel';
import { Automaton } from '../utils/automaton';

export enum WorldPhase {
  EMPTY = 0,
  GENERATION = 1,
  SIMULATION = 2
}

export class World {
  model: WorldModel = new WorldModel();
  worldAutomaton: Automaton;
  entitySystem: EntitySystem;
  events: EventManager;
  reverie: Reverie;
  creator: Entity;
  entities: Entity[];
  private seed = 'default world';

  // Update properties
  private startTime = new Date();
  private lastUpdateTime = this.startTime.getTime();
  private lastClientUpdateTime = this.startTime.getTime();
  private pauseStartTime = this.startTime.getTime();
  private worldTime = this.startTime.getTime();
  private cycles = 0;
  private isUpdating = false;
  private isPaused = false;

  // State properties
  private currentPhase = WorldPhase.EMPTY;

  constructor (events: EventManager, reverie: Reverie) {
    this.events = events;
    this.reverie = reverie;
    this.entitySystem = new EntitySystem();
    this.registerEvents(events);
  }

  /**
   * Registers event handlers that the world listens
   * to on the main Reverie eventer.
   */
  registerEvents (events: EventManager) {
    events.on('client/connect', (e: Client) => this.onNewClient(e));
    events.on('entity/message', (e: Packets.ClientMessage) => this.onEntityMessage(e));
    events.on('entity/move', (e: Packets.EntityMove) => this.onEntityMove(e));
  }

  /**
   * Creates a new entity for the new
   * connection on the network.
   */
  onNewClient (client: Client) {
    let entity = this.entitySystem.create();
    switch (this.currentPhase) {
      case WorldPhase.EMPTY:
        this.creator = entity;
        client.send('entity/init', entity);
        break;
      case WorldPhase.GENERATION:
        client.send('entity/init', entity);
        client.send('world/init', this.model);
        break;
      case WorldPhase.SIMULATION:
        client.send('entity/init', entity);
        break;
    }
  }

  /**
   * Parses the message sent by a client
   * to the world.
   */
  onEntityMessage (e: Packets.ClientMessage) {
    switch (this.currentPhase) {
      case WorldPhase.EMPTY:
        if (e.message === 'generate world') {
          this.generate();
          e.client.send('world/generate', this.model);
        }
        break;
      case WorldPhase.GENERATION:
        if (e.message === 'get world') e.client.send('world/info', {
          seed: this.seed,
          cycles: this.cycles,
          currentPhaseId: this.currentPhase,
          currentPhase: WorldPhase[this.currentPhase],
          model: this.model,
          auto: this.worldAutomaton
        });
        if (e.message === 'destroy world') {
          this.destroy();
          e.client.send('world/destroy');
        }
        break;
      case WorldPhase.SIMULATION:
        break;
    }
  }

  /**
   * Moves an entity in the world.
   */
  onEntityMove (e: Packets.EntityMove) {
    console.log('new entity moved', e);
  }
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

    // Phase updates
    if (!this.isPaused) {
      switch (this.currentPhase) {
        case WorldPhase.GENERATION:
          this.updateGeneration(delta);
          break;
        case WorldPhase.SIMULATION:
          this.updateSimulation(delta);
          break;
      }
    }

    // send world update every ~1s
    if (now.getTime() - this.lastClientUpdateTime > 1000) {
      this.events.emit('world/update', this.worldAutomaton);
      this.lastClientUpdateTime = now.getTime();
    }
    this.isUpdating = false;
  }
  /**
   * Logic loop in the Generation phase of the world.
   */
  updateGeneration(delta: number) {
    if (this.cycles % 1000 === 0) {
      this.worldAutomaton.next();
    }
  }
  generate() {
    if (this.currentPhase === WorldPhase.EMPTY) {
      this.model.x = 50;
      this.model.y = 50;
      this.worldAutomaton = new Automaton(this.model.x, this.model.y);
      this.currentPhase = WorldPhase.GENERATION;
    }
  }
  /**
   * Logic loop in the Simulation phase of the world.
   * @param delta Amount of time to simulate
   */
  updateSimulation(delta: number) {
  }
  /**
   * Cleanup process for removing the world.
   */
  destroy () {
    if (this.currentPhase !== WorldPhase.EMPTY) {
      this.worldAutomaton = null;
      this.currentPhase = WorldPhase.EMPTY;
    }}
  /**
   * Prints out an overview of the current world state.
   */
  print () {
    return JSON.stringify(this);
  }

  // createEntity () {
  //   let universeComponent = new UniverseComponent('universe');
  //   universeComponent.x = Math.floor(Math.random() * this.x);
  //   universeComponent.y = Math.floor(Math.random() * this.y);
  //   universeComponent.z = Math.floor(Math.random() * this.z);

  //   let entity = new Entity('spirit');
  //   entity.addComponent(universeComponent);

  //   // add to entity list
  //   this.Entities.push(entity);
  //   return entity;
  // }
  // removeEntity (entity: Entity) {
  //   this.Entities.forEach((e, i) => {
  //     if (e.id === entity.id) this.Entities.splice(i, 1);
  //   });
  // }
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
