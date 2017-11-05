/**
 * Event Manager for Reverie.
 * This class acts as a communications channel
 * between multiple Reverie modules. It defines
 * the events which require two or more modules
 * in Reverie.
 */
export class EventManager {
  queue: QueuedEvent[] = [];
  events: RegisteredEvents = {};

  constructor () {}
  registerEvent <T> (event: string, callback: (data?: T) => void) {
    if (this.events[event]) console.log(`Event "${event}" already registered.`);
    else this.events[event] = new EventHandler(event, callback);
  }
  // on (event: string, listener: (...args: any[]) => void) {
  //   if (!this.channels[event]) this.channels[event] = [];
  //   this.channels[event].push(listener);
  // }
  emit <T>(event: string, data?: T) {
    let moduleEvent = new ModuleEvent(event, data);
    this.queue.push(moduleEvent);
  }
  process () {
    // processes all the events queued
    // each queued event calls the listener with
    // the data given to it
    while (this.queue.length > 0) {
      // dequeue first event
      const queuedEvent = this.queue.shift()!;
      const event = this.events[queuedEvent.event];

      if (event) {
        event.callback(queuedEvent.data);
      } else {
        console.log(`Unregistered event "${queuedEvent.event}" emitted.`);
      }
    }
  }
  processNext () {
    // processes the next event in queue
    let queuedEvent = this.queue.shift()!;
    let event = this.events[queuedEvent.event];

    if (event) {
      event.callback(queuedEvent.data);
    } else {
      console.log(`Unregistered event "${queuedEvent.event}" emitted.`);
    }
  }
  getQueue () { return this.queue; }
}

interface QueuedEvent {
  event: string;
  data?: any;
}
interface RegisteredEvents {
  [event: string]: EventHandler;
}
class EventHandler {
  constructor(public event: string, public callback: (...args: any[]) => void) {}
}
class ModuleEvent {
  constructor(public event: string, public data?: any) {}
}