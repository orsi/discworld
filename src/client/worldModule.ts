import { EventChannel } from '../common/services/eventChannel';
import { World, Entity, WorldLocation } from '../common/models';
import { EntityManager } from './entityManager';
import { WorldView } from './views/worldView';

export class WorldModule {
  entities: EntityManager;
  events: EventChannel;
  agentEntitySerial: string;
  world: World;
  map: any[][];
  view: WorldView;
  constructor  (events: EventChannel) {
    this.events = events;
    this.entities = new EntityManager(this);
    this.view = new WorldView(this);
  }
  update (delta: number) {}
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
  getAgentEntity () {
    if (this.agentEntitySerial) return this.findEntity(this.agentEntitySerial);
  }
  findEntity (serial: string) {
    let entity = this.entities.get(serial);
    return entity;
  }
  onEntityInfo (entityInfo: Entity) {
    let entity = this.entities.get(entityInfo.serial);
    if (!entity) entity = this.entities.create(entityInfo);
  }
  onRemoveEntity (serial: string) {
    console.log('remove entity', serial);
    this.entities.remove(serial);
  }
  onEntityMove(data: any) {
    console.log('>> move entity ', data);
    let entity = this.entities.get(data.serial);
    if (!entity) return;
    entity.move(data.x, data.y);
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