import { EventManager } from '../common/eventManager';

export class Input {
  events: EventManager;
  totalTime = 0;

  constructor (events: EventManager) {
    this.events = events;

    // general browser events
    window.addEventListener('contextmenu',  (e) => e.preventDefault()); // prevents context menu
    window.addEventListener('resize',       (e) => events.emit('window/resize', e));

    // mouse events
    document.addEventListener('keydown',    (e) => events.emit('input/keydown', <KeyboardEvent>e));
    document.addEventListener('keyup',      (e) => events.emit('input/keyup', <KeyboardEvent>e));
    document.addEventListener('mousedown',  (e) => events.emit('input/mousedown', <MouseEvent>e));
    document.addEventListener('mouseup',    (e) => events.emit('input/mouseup', <MouseEvent>e));
    document.addEventListener('mousemove',  (e) => events.emit('input/mousemove', <MouseEvent>e));
    document.addEventListener('wheel',      (e) => events.emit('input/mousewheel', <WheelEvent>e));
  }
}