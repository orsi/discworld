import * as events from 'events';

export class EventManager {
  private emitter = new events.EventEmitter();
  on (eventType: string, listener: (...args: any[]) => void) {
    this.emitter.on(eventType, listener);
  }
  emit (eventType: string, data?: any, cb?: (...args: any[]) => void) {
    console.log('emitted: ', eventType, data, cb);
    this.emitter.emit(eventType, data, cb);
  }
}