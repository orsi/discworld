import { Client } from './client';
import { EventChannel } from '../common/services/eventChannel';
import { World, Entity, WorldLocation } from '../common/models';
import { Tile } from '../common/data/tiles';
import { EntityManager } from './world/entityManager';
import { WorldComponent, TerminalComponent, Component } from './components/';

export class WorldModule {
  events: EventChannel;
  socket: SocketIO.Socket;
  entities: EntityManager;
  agentEntitySerial: string;
  world: World;
  map: WorldLocation[][] = [];
  worldComponent: WorldComponent;
  terminalComponent: TerminalComponent;
  interfaceComponents: Component[] = [];
  locations: { [key: string]: WorldLocation } = {};

  constructor  (client: Client) {
    const events = this.events = client.events;
    this.entities = new EntityManager(this);

    this.worldComponent = client.dom.addComponent<WorldComponent>(new WorldComponent(this));
    this.terminalComponent = client.dom.addComponent<TerminalComponent>(new TerminalComponent(this));

    events.on('connect', (data) => this.onServerConnect(data));
  }
  update (delta: number) {}

  onServerConnect (socket: SocketIO.Socket) {
    this.socket = socket;
    socket.on('client/entity', (data) => this.onClientEntity(data));
    socket.on('world/info', (data) => this.onInfo(data));
    socket.on('world/location', (data) => this.onLocation(data));
    socket.on('entity/move', (data) => this.onEntityMove(data));
    socket.on('entity/remove', (data) => this.onEntityRemove(data));
  }

  destroy () {}

  // Events
  onClientEntity (serial: string) {
    console.log('got agent', serial);
    this.agentEntitySerial = serial;
  }
  onInfo (world: World) {
    console.log('world info', world);
    this.world = world;
  }
  onLocation (location: WorldLocation) {
    this.locations[location.serial] = location;
    this.worldComponent.addLocationComponent(location);
  }
  onMap (map: WorldLocation[][]) {
    console.log('world map', map);
    this.map = map;
  }
  onEntityRemove (serial: string) {
    console.log('remove entity', serial);
    this.entities.remove(serial);
  }
  onEntityMove(data: Entity) {
    console.log('>> move entity ', data);
    let entity = this.entities.get(data.serial);
    if (!entity) {
      entity = this.entities.create(data);
      this.worldComponent.addEntityComponent(entity.entity);
    }
    entity.move(data.location);
  }
  isLocation(x: number, y: number) {
      return x >= 0 && x < this.world.width && y >= 0 && y < this.world.height;
  }
  getLocation (x: number, y: number) {
    let location;
    for (let ix = 0; ix < this.map.length; ix++) {
      for (let iy = 0; iy < this.map[ix].length; iy++) {
        if (this.map[ix][iy].x === x && this.map[ix][iy].y === y) location = this.map[ix][iy];
      }
    }
    return location ? location : new WorldLocation(
        x,
        y,
        -1,
        false,
        Tile.NULL,
        0
    );
  }
  getAgentEntity () {
    return this.findEntity(this.agentEntitySerial);
  }
  findEntity (serial: string) {
    let entity = this.entities.get(serial);
    return entity;
  }
  onTerminalMessage (message: string) {
      console.log('>> message sent: ', message);
      this.socket.emit('message', message);
  }
}