import { EventManager } from '../eventManager';
import { Entity } from './entity';
import { WorldInterface } from './elements/worldInterface';

export class World {
  playerEntity: Entity;
  entities: Entity[] = [];
  events: EventManager;
  worldInterface: WorldInterface;
  constructor  (events: EventManager) {
    this.events = events;

    // create interface
    this.worldInterface = new WorldInterface(events);
    const body = document.querySelector('#reverie');
    body!.appendChild(this.worldInterface);

    // incoming events
    events.on('world/update', (worldUpdate) => this.onWorldUpdate(worldUpdate));
    events.on('player/update', (playerUpdate) => this.onPlayerUpdate(playerUpdate));
    events.on('entity/update', (entityUpdate) => this.onEntityUpdate(entityUpdate));
    events.on('tile/update', (tileUpdate) => this.onTileUpdate(tileUpdate));
  }

  draw (delta: number) {}
  onWorldUpdate (worldUpdate: any) {
    console.log(worldUpdate);
  }
  onPlayerUpdate (playerUpdate: any) {
    console.log(playerUpdate);
  }
  onEntityUpdate (entityUpdate: any) {
    console.log(entityUpdate);
  }
  onTileUpdate (tileUpdate: any) {
    console.log(tileUpdate);
  }
}