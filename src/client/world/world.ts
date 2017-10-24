import { EventManager } from '../eventManager';
import { Entity } from './entity';
import { WorldInterface } from './elements/worldInterface';
import { WorldModel } from './models/worldModel';

export class World {
  playerEntity: Entity;
  entities: Entity[] = [];
  events: EventManager;
  model: WorldModel;
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

  draw (delta: number) {}
  onWorldInit (data: any) {
    console.log(data);
    this.model = new WorldModel(data);
    console.log(this.model);
  }
  onWorldUpdate (worldUpdate: any) {
    console.log(worldUpdate);
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