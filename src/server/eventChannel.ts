import * as events from 'events';
import log from './decorators';
const globalEmitter = new events.EventEmitter();


const registeredModules: Array<EventModule> = [];
const messageQueue: Array<EventMessage> = [];

export function register (name: string) {
  const em = new EventModule(name);
  registeredModules.push(em);

  return em;
}
export function getEventModule (name: string) {
  return registeredModules.forEach((em: EventModule) => name == em.name ? em : undefined);
}

// current issue:
// event emitter becomes massive after so many worlds are created
// since each world attaches a new event listener, instead of using
// the old one

class EventModule {
  private eventListeners: Array<EventListener>;
  constructor (public name: string) {}

  @log
  emit (eventName: string, data: any, cb: () => void) {
    globalEmitter.emit(eventName, data, cb);
  }
  on (name: string, listener: () => void) {
    this.eventListeners.push({
      name: name,
      listener: listener
    });
    globalEmitter.on(name, listener);
  }
  push() {

  }
  unregister() {
    this.eventListeners.forEach(eventListener => {
      globalEmitter.removeListener(eventListener.name, eventListener.listener);
    });
  }
}

interface EventListener {
  name: string;
  listener: () => void;
}

class EventMessage {}