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
  onCreate (seed: string = 'reverie') {
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

      let x = 5;
      let y = 5;
      let location = this.maps.getLocation(x, y);
      entity.move(location);
      entity.send('world/info', this.world);
      let map = this.maps.getRegionAt(x, y);
      map.forEach(x => {
        x.forEach(location => entity.send('world/location', location));
      });
      entity.send('entity/move', entity.entity);
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

    if (!this.world) return;

    let x = 5;
    let y = 5;
    let location = this.maps.getLocation(x, y);
    entity.move(location);

    entity.send('world/info', this.world);
    let map = this.maps.getRegionAt(x, y);
    map.forEach(x => {
      x.forEach(location => entity.send('world/location', location));
    });
    // get entities in range
    let entities = this.entities.find((e) => {
      return this.maps.isLocationInRegion(e.entity.location, location);
    });
    for (let e of entities) {
      entity.send('entity/move', e.entity);
    }
  }
  onEntityDisconnect (sEntity: SocketEntity, data: any) {
    if (!this.world) return;
    // get entities in range
    let entities = this.entities.find((e) => {
      return this.maps.isLocationInRegion(sEntity.entity.location, e.entity.location);
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
        this.onCreate();
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

    let newLocation = this.parsePosition(sEntity.entity.location.x, sEntity.entity.location.y, data);

    let location = this.maps.getLocation(newLocation.x,  newLocation.y);
    if (!this.maps.canTravelToLocation(location)) return;

    sEntity.move(location);
    let map = this.maps.getRegionAt(newLocation.x, newLocation.y);
    map.forEach(x => {
      x.forEach(location => sEntity.send('world/location', location));
    });

    // get entities in range
    let entities = this.entities.find((e) => {
      return this.maps.isLocationInRegion(e.entity.location, sEntity.entity.location);
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