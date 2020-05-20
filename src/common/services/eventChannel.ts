/**
 * Event Manager for Discworld.
 * This class acts as a communications channel
 * between multiple Discworld modules.
 */
export class EventChannel {
  queue: { event: string; data?: any; }[] = [];
  events: { [event: string]: Function[] } = {};

  on (event: string, callback: (data?: any) => void) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
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
      const callbacks = this.events[queuedEvent.event];

      if (!callbacks || callbacks.length === 0) {
        console.log(`No handlers for event "${queuedEvent.event}".`);
        return;
      }

      for (let cb of callbacks) {
        cb(queuedEvent.data);
      }
    }
  }
}