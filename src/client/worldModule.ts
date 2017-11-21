import { EventChannel } from '../common/services/eventChannel';
import { World, Entity, WorldLocation } from '../common/models';
import { EntityManager } from './entityManager';
import { WorldView } from './views/worldView';

export class WorldModule {
  entities: EntityManager;
  events: EventChannel;
  agentEntitySerial: string;
  world: World;
  map: Map<{x: number, y: number }, WorldLocation> = new Map();
  view: WorldView;
  constructor  (events: EventChannel) {
    this.events = events;
    this.entities = new EntityManager(this);
    this.view = new WorldView(this);
  }
  update (delta: number) {}
  destroy () {}
  onWorldInfo (world: World) {
    console.log('world info', world);
    this.world = world;
  }
  onWorldMap (map: Map<{x: number, y: number}, WorldLocation>) {
    console.log('world map', map);
    this.map = map;
  }
  updateWorld (worldModel: World) {}
  setAgentEntity (serial: string) {
    this.agentEntitySerial = serial;
  }
  getAgentEntity () {
    if (this.agentEntitySerial) return this.findEntity(this.agentEntitySerial);
  }
  findEntity (serial: string) {
    let entity = this.entities.get(serial);
    return entity;
  }
  onEntityInfo (entityInfo: Entity) {
    console.log('entity info', entityInfo);
    let entity = this.entities.get(entityInfo.serial);
    if (!entity) entity = this.entities.create(entity);
  }
  removeEntity (serial: string) {
    console.log('remove entity', serial);
    this.entities.remove(serial);
  }
  moveEntity(direction: string) {
    this.events.emit('entity/move', direction);
  }
  loadTile (data: any) {
    console.log('load tile', data);
  }
  updateTile (data: any) {
    console.log('update tile', data);
  }

  lastMouseEvent: MouseEvent;
  onMouseDown (e: MouseEvent) {
    console.log('click on world', e);
    this.lastMouseEvent = e;
  }
  onMouseUp (e: MouseEvent) {
    this.lastMouseEvent = e;
  }
}