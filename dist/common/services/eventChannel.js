"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Event Manager for Reverie.
 * This class acts as a communications channel
 * between multiple Reverie modules.
 */
class EventChannel {
    constructor() {
        this.queue = [];
        this.events = {};
    }
    on(event, callback) {
        if (!this.events[event])
            this.events[event] = [];
        this.events[event].push(callback);
    }
    emit(event, data) {
        this.queue.push({
            event: event,
            data: data
        });
    }
    process() {
        // processes all the events queued
        // each queued event calls the listener with
        // the data given to it
        while (this.queue.length > 0) {
            // dequeue first event
            const queuedEvent = this.queue.shift();
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
exports.EventChannel = EventChannel;
//# sourceMappingURL=eventChannel.js.map