import { EventManager } from '../common/eventManager';
import { WorldModel } from '../common/world/models/worldModel';
import * as WorldEvents from '../common/world/worldEvents';
import { EntitySystem } from '../common/ecs/entitySystem';
import { Entity } from '../common/ecs/entity';
import * as EntityEvents from '../common/ecs/entityEvents';
import { WorldView } from './views/worldView';

export class World {
  entities: EntitySystem;
  events: EventManager;
  agentEntitySerial: string;
  model: WorldModel;
  view: WorldView;
  constructor  (events: EventManager) {
    this.events = events;
    this.entities = new EntitySystem();
    this.view = new WorldView(this);
  }
  update (delta: number) {}
  destroy () {}
  loadWorld (world: WorldModel) {
    if (this.model) {
      this.destroy();
    }
    this.model = world;
  }
  updateWorld (worldModel: WorldModel) {
    if (!this.model) {
      this.model = worldModel;
    } else {
      this.model.map = worldModel.map;
    }
  }
  setAgentEntity (serial: string) {
    this.agentEntitySerial = serial;
  }
  getAgentEntity () {
    if (this.agentEntitySerial) return this.findEntity(this.agentEntitySerial);
  }
  findEntity (serial: string) {
    let entity = this.entities.getEntityBySerial(serial);
    return entity;
  }
  addEntity (entity: Entity) {
    console.log('add entity', entity);
    this.entities.create(entity);
  }
  updateEntity (entity: Entity) {
    console.log('update entity', entity);
    this.entities.updateEntity(entity.serial, entity);
  }
  removeEntity (entitySerial: string) {
    console.log('remove entity', entitySerial);
    this.entities.destroy(entitySerial);
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