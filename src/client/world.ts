import { EventManager } from '../common/eventManager';
import { WorldView } from './views/worldView';
import { WorldModel } from '../common/world/models/worldModel';
import * as WorldEvents from '../common/world/worldEvents';
import { EntitySystem } from '../common/ecs/entitySystem';
import { Entity } from '../common/ecs/entity';
import { EntityView } from './views/entityView';
import * as EntityEvents from '../common/ecs/entityEvents';

export class World {
  ecs: EntitySystem;
  entityView: EntityView;
  events: EventManager;
  agentEntity: Entity;
  model: WorldModel;
  view: WorldView;
  constructor  (events: EventManager) {
    this.events = events;
    this.ecs = new EntitySystem();
    this.entityView = new EntityView();
  }
  update (delta: number) {}
  draw (ctx: CanvasRenderingContext2D) {
    if (this.model) this.view.draw(ctx);
    let entities = this.ecs.getAllEntities();
    entities.forEach(entity => {
      this.entityView.draw(ctx, entity);
    });
  }
  destroy () {}
  loadWorld (world: WorldModel) {
    if (this.model) {
      this.destroy();
    }
    this.model = world;
    this.view = new WorldView(this.model);
  }
  updateWorld (worldModel: WorldModel) {
    if (!this.model) {
      this.model = worldModel;
      this.view = new WorldView(this.model);
    } else {
      this.model.map = worldModel.map;
    }
  }
  findAgentEntity (serial: string) {
    let entity = this.ecs.getEntityBySerial(serial);
    if (entity) {
      this.agentEntity = entity;
    }
  }
  addEntity (entity: Entity) {
    console.log('add entity', entity);
    this.ecs.create(entity);
  }
  updateEntity (entity: Entity) {
    console.log('update entity', entity);
    this.ecs.updateEntity(entity.serial, entity);
  }
  removeEntity (entitySerial: string) {
    console.log('remove entity', entitySerial);
    this.ecs.destroy(entitySerial);
  }
  loadTile (data: any) {
    console.log('load tile', data);
  }
  updateTile (data: any) {
    console.log('update tile', data);
  }
}