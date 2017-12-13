import { Reverie } from './reverie';
import { EventChannel } from '../common/services/eventChannel';
import { EntityManager } from './world/entityManager';
import { World, WorldState, WorldRegion, WorldLocation, Tile } from '../common/models';
import { PRNG, uuid } from '../common/utils';
import { MapManager } from './world/mapManager';
import { Client } from './client';

export class WorldModule {
  reverie: Reverie;
  events: EventChannel;
  model: World | void;
  maps: MapManager;
  regions: WorldRegion[] = [];
  entities: EntityManager;
  clients: { [serial: string]: Client } = {};

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
    events.on('connection', (data) => this.onClientConnection(data));

    // create world
    this.onCreate();
  }
  update (delta: number) {
    this.cycles++;
    this.worldTime += delta;
    this.lastUpdateTime = this.worldTime;

    // main update
    this.entities.update(delta);
  }
  destroy () {
    this.model = undefined;
  }

  // Eventing Routes
  onCreate (seed: string = 'reverie') {
    // get entity
    // get current world
    // if entity can create world, and world doesn't exist, create world
    // if entity can't, or world exists, reject

    this.model = new World();
    this.model.seed = seed;
    this.model.width = 192;
    this.model.height = 192;

    this.maps.createMap(this.model);

    this.model.state = WorldState.SIMULATING;

    // give all clients an entity and send info
    for (let serial in this.clients) {
      let client = this.clients[serial];

      // create entity for client
      let entity = this.entities.create();
      client.entity = entity;
      // find location for client
      let x = 5;
      let y = 5;
      let location = this.maps.getLocation(x, y);
      client.entity.moveTo(location);
      client.send('client/entity', client.entity);
    }

    // all clients have a position, now send region data
    for (let serial in this.clients) {
      let client = this.clients[serial];

      // send new world
      client.send('world/info', this.model);

      // send region to client
      let map = this.maps.getRegionAt(client.entity.location.x, client.entity.location.y);
      map.forEach(x => {
        x.forEach(location => client.send('world/location', location));
      });

      // send other entities in range
      for (let serial in this.clients) {
        let c = this.clients[serial];
        if (this.maps.isLocationInRegion(c.entity.location, client.entity.location)) client.send('entity/move', c.entity);
      }
    }
  }
  onClientConnection (socket: SocketIO.Socket) {
    // new client has connected to world
    // create entity for client
    // return entity information for client
    // find location of entity, send world data in view
    // check if other entities are in view, send entities
    let client = new Client(socket, this);
    this.clients[client.serial] = client;

    if (!this.model) return;

    // world exists, create entity for client
    client.send('world/info', this.model);

    let entity = client.entity = this.entities.create();

    let x = 5;
    let y = 5;
    let location = this.maps.getLocation(x, y);
    entity.moveTo(location);
    client.send('client/entity', client.entity);

    let map = this.maps.getRegionAt(x, y);
    map.forEach(x => {
      x.forEach(location => client.send('world/location', location));
    });

    // send new entity to clients in range
    for (let serial in this.clients) {
      let c = this.clients[serial];
      if (this.maps.isLocationInRegion(location, c.entity.location)) c.send('entity/move', client.entity);
    }
  }
  onEntityDisconnect (client: Client) {
    if (!this.model) return;

    // send remove entity to clients in region
    for (let serial in this.clients) {
      let c = this.clients[serial];
      if (this.maps.isLocationInRegion(client.entity.location, c.entity.location)) c.send('entity/remove', client.entity.serial);
    }

    // remove entity/client
    this.entities.remove(client.entity.serial);
    delete this.clients[client.entity.serial];
  }
  onClientSpeech (client: Client, speech: string) {
    console.log(speech);
    // get entity
    // check if entity can perform action
    switch (speech) {
      case '/generate':
        this.onCreate();
        break;
      case '/destroy':
        this.destroy();
        break;
      default:
        if (!client.entity) return;
        client.entity.speak(speech);
        // send speech to all clients in region
        for (let serial in this.clients) {
          let to = this.clients[serial];
          if (this.maps.isLocationInRegion(to.entity.location, client.entity.location)) {
            to.send('entity/speech', client.entity.serial, speech);
            console.log(`sent entity/speech '${speech}' to ${to.serial}`);
          }
        }
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
  onEntityMove (client: Client, data: any) {
    // get entity current location
    // get request world location they wish to move to
    // check if entity can move to location
    // if they can, move entity to location
    // if they can't, reject movement

    if (!this.model) return;

    let newLocation = this.parsePosition(client.entity.location.x, client.entity.location.y, data);

    let location = this.maps.getLocation(newLocation.x,  newLocation.y);
    if (!this.maps.canTravelToLocation(location)) return;

    client.entity.moveTo(location);
    let map = this.maps.getRegionAt(newLocation.x, newLocation.y);
    map.forEach(x => {
      x.forEach(location => client.send('world/location', location));
    });

    // send client location to clients in range
    for (let serial in this.clients) {
      let to = this.clients[serial];
      if (this.maps.isLocationInRegion(to.entity.location, client.entity.location)) to.send('entity/move', client.entity);
    }
  }
  onEntityAction (sEntity: Client, data: any) {
    // get entity
    // check if entity can perform action
  }
  onEntityInteract (sEntity: Client, data: any) {
    // get entity
    // get object entity wants to interact with
    // check if entity cna interact with it
    // if entity can, perform interaction with object
    // if entity can't, reject
  }
  onEntityFocus (sEntity: Client, data: any) {
    // get entity
    // get object entity wants to focus
    // check if entity can focus on object
    // return information if entity can focus on it
  }
}