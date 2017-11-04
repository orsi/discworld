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
  loadWorld (data: any) {
    if (this.model) {
      this.destroy();
    }
    this.model = data.model;
    this.view = new WorldView(this.model);
  }
  updateWorld (data: any) {
    if (data.model && !this.model) {
      this.model = data.model;
      this.view = new WorldView(this.model);
    } else if (data.model && this.model) {
      this.model.map = data.model.map;
    }
  }
  findAgentEntity (serial: string) {
    let entity = this.ecs.getEntityBySerial(serial);
    if (entity) {
      this.agentEntity = entity;
    }
  }
  addEntity (entityCreate: EntityEvents.Create) {
    console.log('add entity', entityCreate);
    this.ecs.create(entityCreate.entity);
  }
  updateEntity (data: any) {
    console.log('update entity', data);
    this.ecs.updateEntity(data.entity.serial, data.entity);
  }
  loadTile (data: any) {
    console.log('load tile', data);
  }
  updateTile (data: any) {
    console.log('update tile', data);
  }
}