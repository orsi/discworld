import * as events from 'events';

export default class EventChannel {
  private globalEmitter = new events.EventEmitter();
  private MessageQueue: Array<IEventMessage> = [];
  constructor () {}
  flush (): void {
    this.MessageQueue.forEach((message: IEventMessage) => {
      this.globalEmitter.emit(message.eventName, message.data);
    });
    this.MessageQueue.length = 0;
  }
   private eventListeners: Array<EventListener>;

  // @Log.log(logger.LEVELS.DEBUG)
  emit (eventName: string, data?: any, cb?: () => void): void {
    this.MessageQueue.push({
      eventName: eventName,
      data: data,
      cb: cb
    });
  }
  emitSync (eventName: string, data?: any, cb?: () => void): void {
    this.globalEmitter.emit(eventName, data, cb);
  }
  on (name: string, listener: () => void) {
    this.globalEmitter.on(name, listener);
  }
}

// current issue:
// event emitter becomes massive after so many worlds are created
// since each world attaches a new event listener, instead of using
// the old one
