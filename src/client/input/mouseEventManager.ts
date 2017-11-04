import { EventManager } from '../../common/eventManager';

export class MouseEventManager {
    events: EventManager;
    lastMouseEvent: MouseEvent;

    constructor(events: EventManager) {
        this.events = events;
    }

    onMouseClick (e: MouseEvent) {
        this.lastMouseEvent = e;
        this.events.emit('input/mouse/click', e);
    }
    onMouseDoubleClick (e: MouseEvent) {
        this.lastMouseEvent = e;
        this.events.emit('input/mouse/doubleClick', e);
    }
    onMouseDown (e: MouseEvent) {
        this.lastMouseEvent = e;
        this.events.emit('input/mouse/down', e);
    }
    onMouseUp (e: MouseEvent) {
        this.lastMouseEvent = e;
        this.events.emit('input/mouse/up', e);
    }
    onMouseMove (e: MouseEvent) {
        this.lastMouseEvent = e;
        this.events.emit('input/mouse/move', e);
    }
    onMouseEnter (e: MouseEvent) {}
    onMouseLeave (e: MouseEvent) {}
    onMouseOver (e: MouseEvent) {}
    onMouseOut (e: MouseEvent) {}
    onMouseWheel (e: WheelEvent) {
        this.events.emit('input/mouse/wheel', e);
    }
}

// Some older code

// Mouse click
//   if (e.button === 0) this.events.emit('player/inspect', e);
//   else if (e.button === 2) {
//     switch (this.mouseLocation) {
//       case 'topLeft':
//         this.events.emit('player/move', {
//           dir: 'west'
//         });
//         break;
//       case 'topCenter':
//         this.events.emit('player/move', {
//           dir: 'northWest'
//         });
//         break;
//       case 'topRight':
//         this.events.emit('player/move', {
//           dir: 'north'
//         });
//         break;
//       case 'centerLeft':
//         this.events.emit('player/move', {
//           dir: 'southWest'
//         });
//         break;
//       case 'centerCenter':
//         break;
//       case 'centerRight':
//         this.events.emit('player/move', {
//           dir: 'northEast'
//         });
//         break;
//       case 'bottomLeft':
//         this.events.emit('player/move', {
//           dir: 'south'
//         });
//         break;
//       case 'bottomCenter':
//         this.events.emit('player/move', {
//           dir: 'southEast'
//         });
//         break;
//       case 'bottomRight':
//         this.events.emit('player/move', {
//           dir: 'east'
//         });
//         break;
//     }
//   }

// Mouse move
// break up area into 6
// topLeft, topCenter, topRight, centerLeft, centerCenter, centerRight, bottomLeft, bottomCenter, and bottomRight
// let xLeft = e.clientX > 0 && e.clientX < window.innerWidth / 3;
// let xCenter = e.clientX > window.innerWidth / 3 && e.clientX < window.innerWidth - (window.innerWidth / 3);
// let xRight = e.clientX > window.innerWidth - (window.innerWidth / 3) && e.clientX < window.innerWidth;

// let yTop = e.clientY > 0 && e.clientY < window.innerHeight / 3;
// let yCenter =  e.clientY > window.innerHeight / 3 && e.clientY < window.innerHeight - (window.innerHeight / 3);
// let yBottom =  e.clientY > window.innerHeight - (window.innerHeight / 3) && e.clientY < window.innerHeight;

// let topLeft = xLeft && yTop;
// let topCenter = xCenter && yTop;
// let topRight = xRight && yTop;

// let centerLeft = xLeft && yCenter;
// let centerCenter = xCenter && yCenter;
// let centerRight = xRight && yCenter;

// let bottomLeft = xLeft && yBottom;
// let bottomCenter = xCenter && yBottom;
// let bottomRight = xRight && yBottom;

// if (topLeft) {
// this.mouseLocation = 'topLeft';
// } else if (topCenter) {
// this.mouseLocation = 'topCenter';
// } else if (topRight) {
// this.mouseLocation = 'topRight';
// } else if (centerLeft) {
// this.mouseLocation = 'centerLeft';
// } else if (centerCenter) {
// this.mouseLocation = 'centerCenter';
// } else if (centerRight) {
// this.mouseLocation = 'centerRight';
// } else if (bottomLeft) {
// this.mouseLocation = 'bottomLeft';
// } else if (bottomCenter) {
// this.mouseLocation = 'bottomCenter';
// } else if (bottomRight) {
// this.mouseLocation = 'bottomRight';
// }