import { EventManager } from '../eventManager';
import { Entity } from './entity';
import { WorldView } from './views/worldView';
import { WorldModel } from '../../common/world/models/worldModel';
import * as WorldEvents from '../../common/world/worldEvents';

export class World {
  playerEntity: Entity;
  entities: Entity[] = [];
  events: EventManager;
  model: WorldModel;
  view: WorldView;
  constructor  (events: EventManager) {
    this.events = events;

    // incoming events
    events.on('world/created', (data) => this.created(data));
    events.on('world/updated', (data) => this.updated(data));
    events.on('agent/created', (data) => this.onEntityInit(data));
    events.on('entity/init', (data) => this.onEntityInit(data));
    events.on('entity/update', (entityUpdate) => this.onEntityUpdate(entityUpdate));
    events.on('tile/update', (tileUpdate) => this.onTileUpdate(tileUpdate));
  }
  update (delta: number) {}
  draw (ctx: CanvasRenderingContext2D) {
    if (this.model) this.view.draw(ctx);
    this.entities.forEach(entity => {
      entity.view.draw(ctx);
    });
  }
  destroy () {}
  created (ce: WorldEvents.Created) {
    console.log(ce.model);
    if (this.model) {
      this.destroy();
    }
    this.model = ce.model;
    this.view = new WorldView(this.model);
  }
  updated (ue: WorldEvents.Updated) {
    if (ue.model && !this.model) {
      this.model = ue.model;
      this.view = new WorldView(this.model);
    } else if (ue.model && this.model) {
      this.model.map = ue.model.map;
    }
  }
  onEntityInit (data: any) {
    this.playerEntity = new Entity(data.entity);
    console.log(this.playerEntity);
  }
  onEntityUpdate (entityUpdate: any) {
    console.log(new Entity(entityUpdate));
  }
  onTileUpdate (tileUpdate: any) {
    console.log(tileUpdate);
  }
}