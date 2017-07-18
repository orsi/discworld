import * as events from 'events';
const globalEmitter = new events.EventEmitter();

// const log = require('./Log').log;

let registeredModules: Array<EventModule>= [];

export function register (name: string) {
  console.log('"' + name + '" module registered to event channel');

  let em = new EventModule(name);
  registeredModules.push(em);

  return em;
}

// current issue:
// event emitter becomes massive after so many worlds are created
// since each world attaches a new event listener, instead of using
// the old one

class EventModule {
  constructor (public name: string) {}
  
  emit (eventName: string, data: any, cb: () => void) {
    console.log('"' + this.name + '" system emitted event "' + eventName + '"');
    globalEmitter.emit(eventName, data, cb);
  }
  on (eventName: string, listener: () => void) {
    globalEmitter.on(eventName, listener);
  }
  push() {}
  unregister() {}
}