import { EventManager } from './eventManager';
import { Terminal } from './input/terminal';

export class InputManager {
  terminal: Terminal;
  mouseInterval: NodeJS.Timer;
  mouseLocation: string;
  mouseEvent: MouseEvent;

  constructor (terminal: HTMLInputElement, public events: EventManager) {
    this.terminal = new Terminal(terminal, this.events);

    // remove context menu
    window.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    // browser based events
    window.addEventListener('resize', () => this.onWindowResize());

    // mouse events
    window.addEventListener('wheel', (e) => this.onMouseWheel(e), false); // IE9, Chrome, Safari, Opera
    window.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('dblclick', (e) => this.onMouseDoubleClick(e));
    window.addEventListener('click', (e) => this.onMouseClick(e));

    // keyboard events
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('keyup', (e) => this.onKeyUp(e));
    document.addEventListener('keypress', (e) => this.onKeyPress(e));

  }
  onWindowResize () {}
  onMouseWheel (e: WheelEvent) {
    if (e.deltaY < 0) {
      this.events.emit('player/levitate', 'in');
    } else {
      this.events.emit('player/levitate', 'out');
    }
  }
  onMouseDown (e: MouseEvent) {
    if (e) {
      this.mouseEvent = e;
    }
    this.mouseInterval = setInterval(() => this.onMouseClick(this.mouseEvent), 1000 / 4);
  }
  onMouseUp (e: MouseEvent) {
    clearInterval(this.mouseInterval);
  }
  onMouseMove (e: MouseEvent) {
    // break up area into 6
    // topLeft, topCenter, topRight, centerLeft, centerCenter, centerRight, bottomLeft, bottomCenter, and bottomRight
    let xLeft = e.clientX > 0 && e.clientX < window.innerWidth / 3;
    let xCenter = e.clientX > window.innerWidth / 3 && e.clientX < window.innerWidth - (window.innerWidth / 3);
    let xRight = e.clientX > window.innerWidth - (window.innerWidth / 3) && e.clientX < window.innerWidth;

    let yTop = e.clientY > 0 && e.clientY < window.innerHeight / 3;
    let yCenter =  e.clientY > window.innerHeight / 3 && e.clientY < window.innerHeight - (window.innerHeight / 3);
    let yBottom =  e.clientY > window.innerHeight - (window.innerHeight / 3) && e.clientY < window.innerHeight;

    let topLeft = xLeft && yTop;
    let topCenter = xCenter && yTop;
    let topRight = xRight && yTop;

    let centerLeft = xLeft && yCenter;
    let centerCenter = xCenter && yCenter;
    let centerRight = xRight && yCenter;

    let bottomLeft = xLeft && yBottom;
    let bottomCenter = xCenter && yBottom;
    let bottomRight = xRight && yBottom;

    if (topLeft) {
      this.mouseLocation = 'topLeft';
    } else if (topCenter) {
      this.mouseLocation = 'topCenter';
    } else if (topRight) {
      this.mouseLocation = 'topRight';
    } else if (centerLeft) {
      this.mouseLocation = 'centerLeft';
    } else if (centerCenter) {
      this.mouseLocation = 'centerCenter';
    } else if (centerRight) {
      this.mouseLocation = 'centerRight';
    } else if (bottomLeft) {
      this.mouseLocation = 'bottomLeft';
    } else if (bottomCenter) {
      this.mouseLocation = 'bottomCenter';
    } else if (bottomRight) {
      this.mouseLocation = 'bottomRight';
    }
  }
  onMouseRight (e: MouseEvent) {}
  onMouseDoubleClick (e: MouseEvent) {
    // todo, figure out where double click is on canvas
    // console.log(e);
     if (e.button === 0) this.events.emit('player/interact', e);
  }
  onMouseClick (e: MouseEvent) {
    if (e.button === 0) this.events.emit('player/inspect', e);
    else if (e.button === 2) {
      switch (this.mouseLocation) {
        case 'topLeft':
          this.events.emit('player/move', {
            dir: 'west'
          });
          break;
        case 'topCenter':
          this.events.emit('player/move', {
            dir: 'northWest'
          });
          break;
        case 'topRight':
          this.events.emit('player/move', {
            dir: 'north'
          });
          break;
        case 'centerLeft':
          this.events.emit('player/move', {
            dir: 'southWest'
          });
          break;
        case 'centerCenter':
          break;
        case 'centerRight':
          this.events.emit('player/move', {
            dir: 'northEast'
          });
          break;
        case 'bottomLeft':
          this.events.emit('player/move', {
            dir: 'south'
          });
          break;
        case 'bottomCenter':
          this.events.emit('player/move', {
            dir: 'southEast'
          });
          break;
        case 'bottomRight':
          this.events.emit('player/move', {
            dir: 'east'
          });
          break;
      }
    }
  }
  onKeyDown (e: KeyboardEvent) {
    this.terminal.focus();
    switch (e.key) {
      case 'ArrowUp':
        this.terminal.prevHistory();
        break;
      case 'ArrowDown':
        this.terminal.nextHistory();
        break;
      case 'Enter':
        this.terminal.submit();
        break;
    }
  }
  onKeyUp (e: KeyboardEvent) {}
  onKeyPress (e: KeyboardEvent) {}
}
