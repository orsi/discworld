import { EventManager } from '../common/eventManager';

export class InputManager {
  events: EventManager;
  inputEvents: Event[] = [];
  keyboardEvents: KeyboardEvent[] = [];
  mouseEvents: MouseEvent[] = [];
  lastMouseClick: MouseEvent;
  maxMouseClickDistance = 2;
  lastMouseDown: MouseEvent | void;
  minMouseDragDistance = 2;
  totalTime = 0;

  modifiers = {};
  keys: {[keyCode: number]: boolean} = {};
  mouse = {
    isDragging: false,
    left: false,
    right: false,
    middle: false,
    click: false,
    doubleClick: false,
    drag: false,
    x: 0,
    y: 0
  };
  doubleClickWindow = 500;
  clickTimeout: number;
  lastKeyboardEvent: KeyboardEvent;
  lastMouseEvent: MouseEvent;
  constructor (events: EventManager) {
    this.events = events;

    // general browser events
    window.addEventListener('contextmenu', function (e) {
      // prevents right mouse click from opening
      // the browsers context menu
      e.preventDefault();
    });
    window.addEventListener('resize', (e) => {
      events.emit('window/resize', e);
    });

    // mouse events
    window.addEventListener('click', (e) => this.onMouseClick(e));
    window.addEventListener('dblclick', (e) => this.onMouseDoubleClick(e));
    window.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('wheel', (e) => this.onMouseWheel(e));

    // keyboard events
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('keyup', (e) => this.onKeyUp(e));

    // timer for console logs
    setInterval(() => {
      // console.dir('keys', this.keys);
      // console.dir('mouse', this.mouse);
    }, 5000);
  }
  update (delta: number) {
    this.totalTime += delta;

    this.parseInput();
    this.inputEvents.length = 0;
  }
  parseInput () {
    this.inputEvents.forEach(e => {
      if (e.type === 'keydown') this.events.emit('key/press', e);
      if (e.type === 'click') {
        let mouseEvent = <MouseEvent>e;
        if (this.lastMouseClick && (mouseEvent.timeStamp - this.lastMouseClick.timeStamp) < this.doubleClickWindow) {
          // prevents second click from happening right before double click event
        } else {
          this.events.emit('mouse/click', mouseEvent);
          this.lastMouseClick = mouseEvent;
        }
      }
      if (e.type === 'dblclick') this.events.emit('mouse/double', e);
      if (e.type === 'mousedown') this.lastMouseDown = <MouseEvent>e;
      if (e.type === 'mouseup') {
        if (this.mouse.isDragging) {
          this.events.emit('mouse/dragend');
          this.mouse.isDragging = false;
        }
        this.lastMouseDown = undefined;
      }
      if (e.type === 'mousemove') {
        let mouseEvent = <MouseEvent>e;
        this.events.emit('mouse/move', e);
        if (this.lastMouseDown) {
          // check if movement
          let inClickRange = this.checkDistance(
            this.lastMouseDown.clientX,
            this.lastMouseDown.clientY,
            mouseEvent.clientX,
            mouseEvent.clientY,
            this.maxMouseClickDistance
          );
          if (!this.mouse.isDragging && !inClickRange) {
            this.events.emit('mouse/dragstart', e);
            this.mouse.isDragging = true;
          }
        }
      }
    });
  }
  onMouseClick (e: MouseEvent) {
    e.preventDefault();
    this.inputEvents.push(e);
  }
  onMouseDoubleClick (e: MouseEvent) {
    e.preventDefault();
    this.inputEvents.push(e);
  }
  onMouseDown (e: MouseEvent) {
    e.preventDefault();
    this.inputEvents.push(e);
  }
  onMouseUp (e: MouseEvent) {
    e.preventDefault();
    this.inputEvents.push(e);
  }
  onMouseMove (e: MouseEvent) {
    e.preventDefault();
    this.inputEvents.push(e);
  }
  onMouseWheel (e: WheelEvent) {
    e.preventDefault();
    this.inputEvents.push(e);
  }
  onKeyUp (e: KeyboardEvent) {
    e.preventDefault();
    this.inputEvents.push(e);
  }
  onKeyDown (e: KeyboardEvent) {
    e.preventDefault();
    this.inputEvents.push(e);
  }
  checkDistance (x: number, y: number, mx: number, my: number, maxDistance: number) {
    return Math.abs(mx - x) + Math.abs(my - y) < maxDistance;
  }
}
