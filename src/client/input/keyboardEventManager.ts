import { EventManager } from '../eventManager';

export class KeyboardEventManager {
    events: EventManager;
    lastKeyboardEvent: KeyboardEvent;

    constructor(events: EventManager) {
        this.events = events;
    }

    onKeyPress (e: KeyboardEvent) {
        this.lastKeyboardEvent = e;
        this.events.emit('keyboard/press', e);
    }
    onKeyUp (e: KeyboardEvent) {
        this.lastKeyboardEvent = e;
        this.events.emit('keyboard/up', e);
    }
    onKeyDown (e: KeyboardEvent) {
      this.lastKeyboardEvent = e;
      this.events.emit('keyboard/down', e);
    }
}