import { Client } from './client';
import { EventChannel } from '../common/services/eventChannel';
import { World, Entity, WorldLocation } from '../common/models';
import { Tile } from '../common/data/tiles';
import { EntityManager } from './world/entityManager';
import { WorldView } from './views/worldView';

export class WorldModule {
  events: EventChannel;
  socket: SocketIO.Socket;
  entities: EntityManager;
  agentEntitySerial: string;
  world: World;
  map: WorldLocation[][] = [];
  view: WorldView;
  constructor  (client: Client) {
    const events = this.events = client.events;
    this.entities = new EntityManager(this);
    this.view = new WorldView(this);

    events.on('connect', (data) => this.onServerConnect(data));
  }
  update (delta: number) {}

  onServerConnect (socket: SocketIO.Socket) {
    this.socket = socket;
    socket.on('client/entity', (data) => this.onAgentEntity(data));
    socket.on('world/info', (data) => this.onWorldInfo(data));
    socket.on('world/map', (data) => this.onWorldMap(data));
    socket.on('world/update', (data) => this.onWorldUpdate(data));
    socket.on('entity/info', (data) => this.onEntityInfo(data));
    socket.on('entity/move', (data) => this.onEntityMove(data));
    socket.on('entity/destroy', (data) => this.onRemoveEntity(data));
  }

  destroy () {}

  // Events
  onWorldInfo (world: World) {
    console.log('world info', world);
    this.world = world;
  }
  onWorldMap (map: any[][]) {
    console.log('world map', map);
    this.map = map;
  }
  onWorldUpdate (worldModel: World) {}
  onAgentEntity (serial: string) {
    console.log('got agent', serial);
    this.agentEntitySerial = serial;
  }
  onEntityInfo (entityInfo: Entity) {
    let entity = this.entities.get(entityInfo.serial);
    if (!entity) entity = this.entities.create(entityInfo);

    entity.entity = entityInfo;
    console.log('>> entity info: ', entityInfo, entity);
  }
  onRemoveEntity (serial: string) {
    console.log('remove entity', serial);
    this.entities.remove(serial);
  }
  onEntityMove(data: Entity) {
    console.log('>> move entity ', data);
    let entity = this.entities.get(data.serial);
    if (!entity) entity = this.entities.create(data);
    entity.move(data.location);
  }

  lastMouseEvent: MouseEvent;
  onMouseDown (e: MouseEvent) {
    console.log('click on world', e);
    this.lastMouseEvent = e;
  }
  onMouseUp (e: MouseEvent) {
    this.lastMouseEvent = e;
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
    if (this.agentEntitySerial) return this.findEntity(this.agentEntitySerial);
  }
  findEntity (serial: string) {
    let entity = this.entities.get(serial);
    return entity;
  }
}