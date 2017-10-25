import { EventManager } from '../eventManager';
import { Entity } from './entity';
import { WorldInterface } from './elements/worldInterface';
import { WorldModel } from './models/worldModel';
import { WorldView } from './views/worldView';

export class World {
  playerEntity: Entity;
  entities: Entity[] = [];
  events: EventManager;
  model: WorldModel = new WorldModel();
  view: WorldView = new WorldView(this.model);
  interface: WorldInterface;
  constructor  (events: EventManager) {
    this.events = events;

    // create interface
    this.interface = new WorldInterface(events);
    const body = document.querySelector('#reverie');
    body!.appendChild(this.interface);

    // incoming events
    events.on('world/init', (data) => this.onWorldInit(data));
    events.on('world/update', (worldUpdate) => this.onWorldUpdate(worldUpdate));
    events.on('entity/init', (data) => this.onEntityInit(data));
    events.on('entity/update', (entityUpdate) => this.onEntityUpdate(entityUpdate));
    events.on('tile/update', (tileUpdate) => this.onTileUpdate(tileUpdate));
  }
  update (delta: number) {}
  draw (interpolation: number) {
    this.view.draw(interpolation);
  }
  onWorldInit (data: any) {
    console.log(data);
    this.model.x = data.x;
    this.model.y = data.y;
    console.log(this.model);
  }
  onWorldUpdate (worldUpdate: any) {
    this.model.map = worldUpdate;
  }
  onEntityInit (data: any) {
    this.playerEntity = new Entity(data);
    console.log(this.playerEntity);
  }
  onEntityUpdate (entityUpdate: any) {
    console.log(new Entity(entityUpdate));
  }
  onTileUpdate (tileUpdate: any) {
    console.log(tileUpdate);
  }
}