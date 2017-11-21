/**
 * Event Manager for Reverie.
 * This class acts as a communications channel
 * between multiple Reverie modules. It defines
 * the events which require two or more modules
 * in Reverie.
 */
export class EventChannel {
  queue: { event: string; data?: any; }[] = [];
  events: { [event: string]: EventHandler } = {};

  constructor () {}
  on (event: string, callback: (data?: any) => void) {
    if (this.events[event]) console.log(`Event "${event}" already registered.`);
    else this.events[event] = new EventHandler(event, callback);
  }
  emit (event: string, data?: any) {
    this.queue.push({
      event: event,
      data: data
    });
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

class EventHandler {
  constructor(public event: string, public callback: (...args: any[]) => void) {}
}