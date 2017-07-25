import * as events from 'events';
import * as logger from './log';
const globalEmitter = new events.EventEmitter();

export default class EventChannel {
  private static registeredModules: Array<EventModule> = [];
  private static messageQueue: Array<EventMessage> = [];
  constructor () {}

  static register (name: string) {
    const em = new EventModule(name);
    this.registeredModules.push(em);

    return em;
  }
  static getEventModule (name: string): EventModule | void {
    return this.registeredModules.forEach((em: EventModule) => name == em.name ? em : undefined);
  }
  static processMessages (): void {
    this.messageQueue.forEach(message => {
      const module: EventModule = this.getEventModule(message.to) as EventModule;
      if (module) {
        module.action(message.action, message.data);
      }

    });
  }
}


// current issue:
// event emitter becomes massive after so many worlds are created
// since each world attaches a new event listener, instead of using
// the old one

export class EventModule {
  private eventListeners: Array<EventListener>;
  constructor (public name: string) {}

  @logger.log(logger.LEVELS.DEBUG)
  emit (eventName: string, data?: any, cb?: () => void) {
    globalEmitter.emit(eventName, data, cb);
  }
  on (name: string, listener: () => void) {
    this.eventListeners.push({
      name: name,
      listener: listener
    });
    globalEmitter.on(name, listener);
  }
  action (action: string, data?: any) {}
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

class EventMessage {
  to: string;
  from: string;
  action: string;
  data: any;
}