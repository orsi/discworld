let EventManager = require('./EventManager');
let Terminal = require('./input/Terminal');

module.exports = InputManager;

function InputManager () {
  this.mouseInterval = null;
  this.mouseLocation = '';
  this.mouseEvent = null;
  
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

  // register system to events
  this.events = EventManager.register('input');
  this.terminal = new Terminal('#terminal', this.events);
}

InputManager.prototype.onWindowResize = function () {

}
InputManager.prototype.onMouseWheel = function (e) {
  if (e.deltaY < 0) {
    this.events.emit('network/send', 'player/levitate', 'in');
  } else {
    this.events.emit('network/send', 'player/levitate', 'out');
  }
}
InputManager.prototype.onMouseDown = function (e) {
  if (e) {
    this.mouseEvent = e;
  }
  this.mouseInterval = setInterval(() => this.onMouseClick(this.mouseEvent), 1000 / 4);
}
InputManager.prototype.onMouseUp = function (e) {
  clearInterval(this.mouseInterval);
}
InputManager.prototype.onMouseMove = function (e) {
  // break up area into 6
  // topLeft, topCenter, topRight, centerLeft, centerCenter, centerRight, bottomLeft, bottomCenter, and bottomRight
  var xLeft = e.clientX > 0 && e.clientX < window.innerWidth / 3;
  var xCenter = e.clientX > window.innerWidth / 3 && e.clientX < window.innerWidth - (window.innerWidth / 3);
  var xRight = e.clientX > window.innerWidth - (window.innerWidth / 3) && e.clientX < window.innerWidth;

  var yTop = e.clientY > 0 && e.clientY < window.innerHeight / 3;
  var yCenter =  e.clientY > window.innerHeight / 3 && e.clientY < window.innerHeight - (window.innerHeight / 3);
  var yBottom =  e.clientY > window.innerHeight - (window.innerHeight / 3) && e.clientY < window.innerHeight;

  var topLeft = xLeft && yTop;
  var topCenter = xCenter && yTop;
  var topRight = xRight && yTop;

  var centerLeft = xLeft && yCenter;
  var centerCenter = xCenter && yCenter;
  var centerRight = xRight && yCenter;

  var bottomLeft = xLeft && yBottom;
  var bottomCenter = xCenter && yBottom;
  var bottomRight = xRight && yBottom;

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
InputManager.prototype.onMouseRight = function (e) {
  
}
InputManager.prototype.onMouseDoubleClick = function (e) {
  // todo, figure out where double click is on canvas
  // console.log(e);
   if(e.button === 0) this.events.emit('network/send', 'player/interact', e);
}
InputManager.prototype.onMouseClick = function (e) {
  if(e.button === 0) this.events.emit('network/send', 'player/inspect', e);
  else if (e.button === 2) {
    switch (this.mouseLocation) {
      case 'topLeft':
        this.events.emit('network/send', 'player/move', {
          dir: 'west'
        });
        break;
      case 'topCenter':
        this.events.emit('network/send', 'player/move', {
          dir: 'northWest'
        });
        break;
      case 'topRight':
        this.events.emit('network/send', 'player/move', {
          dir: 'north'
        });
        break;
      case 'centerLeft':
        this.events.emit('network/send', 'player/move', {
          dir: 'southWest'
        });
        break;
      case 'centerCenter':
        break;
      case 'centerRight':
        this.events.emit('network/send', 'player/move', {
          dir: 'northEast'
        });
        break;
      case 'bottomLeft':
        this.events.emit('network/send', 'player/move', {
          dir: 'south'
        });
        break;
      case 'bottomCenter':
        this.events.emit('network/send', 'player/move', {
          dir: 'southEast'
        });
        break;
      case 'bottomRight':
        this.events.emit('network/send', 'player/move', {
          dir: 'east'
        });
        break;
    }
  }
}
InputManager.prototype.onKeyDown = function (e) {
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
InputManager.prototype.onKeyUp = function (w) {}
InputManager.prototype.onKeyPress = function (e) {}
