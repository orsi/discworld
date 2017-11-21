import { Reverie } from './reverie';
import { EventChannel } from '../common/services/eventChannel';
import { EntityManager } from './world/entityManager';
import { World, WorldState, WorldRegion, WorldLocation, Tiles } from '../common/models';
import { PRNG } from '../common/utils/prng';
import { Automaton } from '../common/utils/automaton';
import { SocketEntity } from './world/entities/socketEntity';

export class WorldModule {
  reverie: Reverie;
  events: EventChannel;
  world: World;
  map: Map<{x: number, y: number}, WorldLocation> = new Map();
  regions: WorldRegion[] = [];
  entities: EntityManager;
  random: PRNG;

  // Update properties
  startTime = new Date();
  lastUpdateTime = this.startTime.getTime();
  lastUpdatedEventTime = this.startTime.getTime();
  pauseStartTime = this.startTime.getTime();
  worldTime = this.startTime.getTime();
  cycles = 0;
  isUpdating = false;
  isPaused = false;

  constructor (reverie: Reverie) {
    const events = this.events = reverie.events;
    this.entities = new EntityManager(this);
    this.world = new World();

    // from network
    events.on('connection', (data) => this.onEntityConnection(data));
  }
  update (delta: number) {
    this.cycles++;
    this.worldTime += delta;
    this.lastUpdateTime = this.worldTime;

    // main update
    this.entities.update(delta);
  }

  // Eventing Routes
  create (seed: string = 'reverie') {
    // get entity
    // get current world
    // if entity can create world, and world doesn't exist, create world
    // if entity can't, or world exists, reject

    this.world = new World();
    this.world.seed = seed;
    this.random = new PRNG(this.world.seed);
    this.world.width = Math.floor(this.random.range(50, 250));
    this.world.height = Math.floor(this.random.range(50, 250));

    // create regions in world
    // let numRegions = Math.floor(this.random.range(3, 10));
    // for (let i = 0; i < numRegions; i++) {
    //   let region = new WorldRegion();
    //   region.from.x =
    //   this.regions.push(region);
    // }

    // create locations in regions
    let automaton = new Automaton(this.world.width, this.world.height, {
      seed: this.world.seed,
      step: 2
    });
    for (let ix = 0; ix < this.world.width; ix++) {
      for (let iy = 0; iy < this.world.height; iy++) {
        let location = new WorldLocation();
        location.x = ix;
        location.y = iy;
        if (automaton.getMap().get(ix, iy)) {
          let tileIndex = Math.floor(this.random.range(0, Tiles.length - 1));
          location.tile = Tiles[tileIndex];
        } else {
          location.tile = 'sea';
        }
        this.map.set({ x: ix, y: iy }, location);
      }
    }
    this.world.state = WorldState.SIMULATING;
    console.log(this.map);
    // give all entities a position and send info
    let entities = this.entities.getAll();
    for (let e in entities) {
      let entity = <SocketEntity>entities[e];
      let location = this.getRandomLocation()!;
      entity.move(location.x, location.y);
      entity.send('world/info', this.world);
      entity.send('world/map', this.map);
      entity.send('entity/info', entity.entity);
    }
  }
  destroy () {
    this.world = new World();
  }
  onEntityConnection (socket: SocketIO.Socket) {
    // new client has connected to world
    // create entity for client
    // return entity information for client
    // find location of entity, send world data in view
    // check if other entities are in view, send entities
    let entity = this.entities.createSocketEntity(socket);
    entity.send('client/entity', entity.entity.serial);
    entity.send('entity/info', entity.entity);

    let location = this.getRandomLocation()!;
    if (!location) return;
    entity.move(location.x, location.y);

    entity.send('world/info', this.world);
    entity.send('world/map', this.map);
    // get entities in range
    let entities = this.entities.find((e) => {
      if (e.entity.x < location.x + 10
        && e.entity.x > location.x - 10
        && e.entity.y < location.y + 10
      && e.entity.y > location.y - 10) return true;
      return false;
    });
    for (let e of entities) {
      entity.send('entity/info', e.entity);
    }
  }
  onEntityDisconnect (sEntity: SocketEntity, data: any) {
    // get entities in range
    let entities = this.entities.find((e) => {
      if (e.entity.x < sEntity.entity.x + 10
        && e.entity.x > sEntity.entity.x - 10
        && e.entity.y < sEntity.entity.y + 10
      && e.entity.y > sEntity.entity.y - 10) return true;
      return false;
    });
    for (let e of entities) {
      (<SocketEntity>e).send('entity/remove', sEntity.entity.serial);
    }
    this.entities.remove(sEntity.entity.serial);
  }
  onEntityMessage (sEntity: SocketEntity, message: string) {
    console.log(message);
    // get entity
    // check if entity can perform action
    switch (message) {
      case 'generate':
        this.create();
        break;
      case 'destroy':
        this.destroy();
        break;
      default:
        sEntity.speak(message);
        break;
    }
  }
  onEntityMove (sEntity: SocketEntity, data: any) {
    // get entity current location
    // get request world location they wish to move to
    // check if entity can move to location
    // if they can, move entity to location
    // if they can't, reject movement
    console.log('new entity moved: ', sEntity.entity.serial, data);

    let location = this.map.get({ x: data.x, y: data.y});
    if (!location || location.tile === 'rock') return;

    sEntity.move(data.x, data.y);

    // get entities in range
    let entities = this.entities.find((e) => {
      if (e.entity.x < data.x + 10
        && e.entity.x > data.x - 10
        && e.entity.y < data.y + 10
      && e.entity.y > data.y - 10) return true;
      return false;
    });

    // emit to entities in range this entities new movement
    for (let e of entities) {
      // emit to this 'e', the entities movement...
      (<SocketEntity>e).send('entity/move', sEntity.entity);
    }
  }
  onEntityAction (sEntity: SocketEntity, data: any) {
    // get entity
    // check if entity can perform action
  }
  onEntityInteract (sEntity: SocketEntity, data: any) {
    // get entity
    // get object entity wants to interact with
    // check if entity cna interact with it
    // if entity can, perform interaction with object
    // if entity can't, reject
  }
  onEntityFocus (sEntity: SocketEntity, data: any) {
    // get entity
    // get object entity wants to focus
    // check if entity can focus on object
    // return information if entity can focus on it
  }
  getRandomLocation () {
    let x = Math.floor(Math.random() * this.world.width);
    let y = Math.floor(Math.random() * this.world.height);
    return {x: x, y: y};
  }
}