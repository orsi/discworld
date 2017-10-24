export class EventManager {
  queue: QueuedEvent[] = [];
  channels: EventChannel = {};

  on (event: string, listener: (...args: any[]) => void) {
    if (!this.channels[event]) this.channels[event] = [];
    this.channels[event].push(listener);
  }
  emit (event: string, data?: any, cb?: (...args: any[]) => void) {
    this.queue.push({
      event: event,
      data: data,
      cb: cb
    });
  }
  process () {
    // processes all the events queued
    // each queued event calls the listener with
    // the data given to it
    while (this.queue.length > 0) {
      // dequeue first event
      let queuedEvent = this.queue.shift()!;

      // check if event has a channel with listeners
      // call all listeners
      if (this.channels[queuedEvent.event] && this.channels[queuedEvent.event].length > 0) {
        this.channels[queuedEvent.event].forEach(listener => {
          console.log('processed event', queuedEvent);
          listener(queuedEvent.data);
        });
      }
    }
  }
  processOne () {
    // shift next event off queue
    if (this.queue.length > 0) {
      const nextEvent = this.queue.shift()!;
      if (this.channels[nextEvent.event] && this.channels[nextEvent.event].length > 0) {
        this.channels[nextEvent.event].forEach(listener => {
          listener(nextEvent.data);
        });
      }
    }
  }
  getQueue () { return this.queue; }
  getChannels () { return this.channels; }
}

interface QueuedEvent {
  event: string;
  data?: any;
  cb?: (...args: any[]) => void;
}
interface EventChannel {
  [event: string]: ((...args: any[]) => void)[];
}