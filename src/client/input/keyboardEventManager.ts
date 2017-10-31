import { EventManager } from '../../common/eventManager';

export class KeyboardEventManager {
    events: EventManager;
    lastKeyboardEvent: KeyboardEvent;

    constructor(events: EventManager) {
        this.events = events;
    }

    onKeyPress (e: KeyboardEvent) {
        this.lastKeyboardEvent = e;
        this.events.emit('input/keyboard/press', e);
    }
    onKeyUp (e: KeyboardEvent) {
        this.lastKeyboardEvent = e;
        this.events.emit('input/keyboard/up', e);
    }
    onKeyDown (e: KeyboardEvent) {
      this.lastKeyboardEvent = e;
      this.events.emit('input/keyboard/down', e);
    }
}