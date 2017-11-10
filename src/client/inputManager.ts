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
  keys: KeyState = {};
  mouse: MouseState = {
    left: false,
    right: false,
    middle: false,
    x: 0,
    y: 0,
    wheelDelta: 0,
    isDragging: false
  };
  doubleClickWindow = 500;
  clickTimeout: number;
  lastKeyState: KeyState;
  lastMouseState: MouseState;
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
    window.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('wheel', (e) => this.onMouseWheel(e));

    // keyboard events
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('keyup', (e) => this.onKeyUp(e));

    // timer for console logs
    setInterval(() => {
      console.log('keys', this.keys);
      console.log('mouse', this.mouse);
    }, 2000);
  }
  update (delta: number) {
    this.totalTime += delta;
    this.lastMouseState = this.mouse;
    this.lastKeyState = this.keys;
    this.inputEvents.forEach(e => {
      if (e.type === 'keydown') {
        if (!(<KeyboardEvent>e).altKey || !(<KeyboardEvent>e).shiftKey || !(<KeyboardEvent>e).ctrlKey) {
          this.events.emit('key/press', e);
        }
        this.keys[(<KeyboardEvent>e).keyCode] = true;
      }
      if (e.type === 'keyup') {
        this.keys[(<KeyboardEvent>e).keyCode] = false;
      }
      if (e.type === 'mousedown') {
        console.log('mousedown', e);
        if (((<MouseEvent>e).buttons & 0x1) > 0) this.mouse.left = true;
        if (((<MouseEvent>e).buttons & 0x2) > 0) this.mouse.right = true;
        if (((<MouseEvent>e).buttons & 0x4) > 0) this.mouse.middle = true;
        console.log(this.mouse);
      }
      if (e.type === 'mouseup') {
        if (((<MouseEvent>e).buttons & 0x1) === 0) this.mouse.left = false;
        if (((<MouseEvent>e).buttons & 0x2) === 0) this.mouse.right = false;
        if (((<MouseEvent>e).buttons & 0x4) === 0) this.mouse.middle = false;
        this.mouse.isDragging = false;
      }
      if (e.type === 'mousemove') {
        if (this.mouse.left) {
          this.mouse.isDragging = true;
        }
        this.mouse.x = (<MouseEvent>e).clientX;
        this.mouse.y = (<MouseEvent>e).clientY;
      }
    });
    this.inputEvents.length = 0;
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

interface KeyState {
  [keyCode: number]: boolean;
}
interface MouseState {
  left: boolean;
  right: boolean;
  middle: boolean;
  x: number;
  y: number;
  wheelDelta: number;
  isDragging: boolean;
}
