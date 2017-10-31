import { EventManager } from '../common/eventManager';
import { WorldView } from './views/worldView';
import { WorldModel } from '../common/world/models/worldModel';
import * as WorldEvents from '../common/world/worldEvents';
import { EntitySystem } from '../common/ecs/entitySystem';

export class World {
  ecs: EntitySystem;
  events: EventManager;
  model: WorldModel;
  view: WorldView;
  constructor  (events: EventManager) {
    this.events = events;
  }
  update (delta: number) {}
  draw (ctx: CanvasRenderingContext2D) {
    if (this.model) this.view.draw(ctx);
    // this.entities.forEach(entity => {
    //   entity.view.draw(ctx);
    // });
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
  loadEntity (data: any) {
    console.log('load entity', data);
  }
  updateEntity (data: any) {
    console.log('update entity', data);
  }
  loadTile (data: any) {
    console.log('load tile', data);
  }
  updateTile (data: any) {
    console.log('update tile', data);
  }
}