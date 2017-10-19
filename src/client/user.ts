import { EventManager } from './eventManager';

export class User {
  events: EventManager;
  entity: any;
  constructor (events: EventManager) {
    this.events = events;
    events.on('player/init', (e) => this.onReceivePlayerEntity(e));
    events.on('player/update', (e) => this.onReceivePlayerUpdate(e));
  }
  get (name: string) {
    // switch (name) {
    //   case 'entity':
    //     return this.entity;
    //   case 'regions':
    //     break;
    // }
  }
  onReceivePlayerEntity (e: any) {
    console.log(e);
    // this.entity = new Entity(e);
  }
  onReceivePlayerUpdate (e: any) {
    for (let prop in e) {
      this.entity[prop] = e[prop];
    }
  }
}