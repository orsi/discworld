import { EventManager } from './eventManager';
import { Terminal } from './components/terminal';
import { MouseEventManager } from './input/mouseEventManager';
import { KeyboardEventManager } from './input/keyboardEventManager';

/**
 * Input Manager grabs all input from the browser and
 * passes them to the correct manager.
 */
export class InputManager {
  events: EventManager;
  lastEvent: Event;
  mouseEventManager: MouseEventManager;
  keyboardEventManager: KeyboardEventManager;

  constructor (events: EventManager) {
    this.events = events;
    this.mouseEventManager = new MouseEventManager(events);
    this.keyboardEventManager = new KeyboardEventManager(events);

    // general browser events
    window.addEventListener('contextmenu', function (e) {
      // prevents right mouse click from opening
      // the browsers context menu
      e.preventDefault();
    });
    window.addEventListener('resize', (e) => this.onWindowResize(e));

    // mouse events passed to mouse manager
    window.addEventListener('click', (e) => this.mouseEventManager.onMouseClick(e));
    window.addEventListener('dblclick', (e) => this.mouseEventManager.onMouseDoubleClick(e));
    window.addEventListener('mousedown', (e) => this.mouseEventManager.onMouseDown(e));
    window.addEventListener('mouseup', (e) => this.mouseEventManager.onMouseUp(e));
    window.addEventListener('mousemove', (e) => this.mouseEventManager.onMouseMove(e));
    window.addEventListener('mouseenter', (e) => this.mouseEventManager.onMouseEnter(e));
    window.addEventListener('mouseleave', (e) => this.mouseEventManager.onMouseLeave(e));
    window.addEventListener('mouseover', (e) => this.mouseEventManager.onMouseOver(e));
    window.addEventListener('mouseout', (e) => this.mouseEventManager.onMouseOut(e));
    window.addEventListener('wheel', (e) => this.mouseEventManager.onMouseWheel(e), false); // IE9, Chrome, Safari, Opera

    // keyboard events passed to keyboard manager
    document.addEventListener('keydown', (e) => this.keyboardEventManager.onKeyDown(e));
    document.addEventListener('keyup', (e) => this.keyboardEventManager.onKeyUp(e));
    document.addEventListener('keypress', (e) => this.keyboardEventManager.onKeyPress(e));
  }
  getMouseEventManager () { return this.mouseEventManager; }
  onWindowResize (e: Event) {
    this.lastEvent = e;
  }
}
