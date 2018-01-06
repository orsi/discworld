/**
 * Event Service for Reverie.
 */
let queue: { event: string; data?: any; }[] = [];
let events: { [event: string]: Function[] } = {};

export function on (event: string, callback: (data?: any) => void) {
  if (!events[event]) events[event] = [];
  events[event].push(callback);
}
export function emit (event: string, data?: any) {
  queue.push({
    event: event,
    data: data
  });
}
export function process () {
  // processes all the events queued
  // each queued event calls the listener with
  // the data given to it
  while (queue.length > 0) {
    // dequeue first event
    const queuedEvent = queue.shift()!;
    const callbacks = events[queuedEvent.event];

    if (!callbacks || callbacks.length === 0) {
      console.log(`No handlers for event "${queuedEvent.event}".`);
      return;
    }

    for (let cb of callbacks) {
      cb(queuedEvent.data);
    }
  }
}