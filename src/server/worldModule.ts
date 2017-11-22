import { Reverie } from './reverie';
import { EventChannel } from '../common/services/eventChannel';
import { EntityManager } from './world/entityManager';
import { World, WorldState, WorldRegion, WorldLocation, Tile } from '../common/models';
import { PRNG } from '../common/utils/prng';
import { MapManager } from './world/mapManager';
import { SocketEntity } from './world/entities/socketEntity';

export class WorldModule {
  reverie: Reverie;
  events: EventChannel;
  world: World | void;
  maps: MapManager;
  regions: WorldRegion[] = [];
  entities: EntityManager;

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
    this.maps = new MapManager(this);

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
    this.world.width = 192;
    this.world.height = 192;

    this.maps.createMap(this.world);

    this.world.state = WorldState.SIMULATING;

    // give all entities a position and send info
    let entities = this.entities.getAll();
    for (let e in entities) {
      let entity = <SocketEntity>entities[e];

      let x = Math.floor(Math.random() * this.world.width);
      let y = Math.floor(Math.random() * this.world.height);

      entity.move(x, y);
      entity.send('world/info', this.world);
      entity.send('world/map', this.maps.getRegionAt(x, y));
      entity.send('entity/info', entity.entity);
    }
  }
  destroy () {
    this.world = undefined;
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

    if (!this.world) return;

    let x = Math.floor(Math.random() * this.world.width);
    let y = Math.floor(Math.random() * this.world.height);
    entity.move(x, y);

    entity.send('world/info', this.world);
    entity.send('world/map', this.maps.getRegionAt(x, y));
    // get entities in range
    let entities = this.entities.find((e) => {
      if (e.entity.x < x + 10
        && e.entity.x > x - 10
        && e.entity.y < y + 10
      && e.entity.y > y - 10) return true;
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
  parsePosition (x: number, y: number, direction: string) {
    if (direction.indexOf('n') > -1) y--;
    if (direction.indexOf('s') > -1) y++;
    if (direction.indexOf('e') > -1) x++;
    if (direction.indexOf('w') > -1) x--;
    return {
      x: x,
      y: y
    };
  }
  onEntityMove (sEntity: SocketEntity, data: any) {
    // get entity current location
    // get request world location they wish to move to
    // check if entity can move to location
    // if they can, move entity to location
    // if they can't, reject movement
    console.log('>> move request - ', sEntity.entity.serial, data);

    if (!this.world) return;

    let newLocation = this.parsePosition(sEntity.entity.x, sEntity.entity.y, data);

    let location = this.maps.getLocation(newLocation.x,  newLocation.y);
    if (!location || !location.tile || location.tile.name === 'rock') return;

    sEntity.move(newLocation.x, newLocation.y);

    // get entities in range
    let entities = this.entities.find((e) => {
      if (e.entity.x < newLocation.x + 10
        && e.entity.x > newLocation.x - 10
        && e.entity.y < newLocation.y + 10
      && e.entity.y > newLocation.y - 10) return true;
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
}