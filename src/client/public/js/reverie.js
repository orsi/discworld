(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
let debug;
module.exports = {
    init: function () {
        element = document.createElement('div');
        element.id = 'debug';
        element.style.position = 'fixed';
        element.style.zIndex = 9999;
        element.style.top = 0;
        element.style.left = 0;
        element.style.right = 0;
        element.style.fontSize = '.7em';

        debug = document.createElement('pre');
        element.appendChild(debug);

        document.body.appendChild(element);
        return this;
    },
    output: function (debug) {
        let delta = debug.delta;
        let view = debug.view;
        let world = debug.world;
        let entity = debug.entity;

        clear();

        write(Math.floor((1000 / delta)) + 'fps');

        // canvas info
        if (view) {
            write('viewport');
            write(JSON.stringify(view, function replacer(key, value) {
                // Filtering out properties
                if (typeof value === 'function' || typeof value === undefined) {
                    return value.toString();
                }
                return value;
            }, 2));
        }

        // world info
        if (world) {
            write('world');
            write(JSON.stringify(world, function replacer(key, value) {
                // Filtering out properties
                if (typeof value === 'function' || typeof value === undefined) {
                    return value.toString();
                } else if (Array.isArray(value)) {
                    return 'array';
                }
                return value;
            }, 2));
        }

        // entity info
        if (entity) {
            write('entity');
            write(JSON.stringify(entity, function replacer(key, value) {
                // Filtering out properties
                if (typeof value === 'function' || typeof value === undefined) {
                    return value.toString();
                }
                return value;
            }, 2));
        }
    }
}

function write(text) {
    let node = document.createTextNode(text + '\n');
    debug.appendChild(node);
}

function clear () {
    while (debug.hasChildNodes()) {
        debug.removeChild(debug.lastChild);
    }
}
},{}],3:[function(require,module,exports){
var events = require('events');
var emitter = new events.EventEmitter();

var systems = [];
module.exports = {
  register: function (name) {
    for (var i = 0; i < systems.length; i++) {
      if (systems[i].name === name) return systems[i];
    }
    var system = new System(name);
    systems.push(system);
    return system;
  }
}

function System (name) {
  this.name = name;
  this.emitter = emitter;
}
System.prototype.on = function (eventType, listener) {
  emitter.on(eventType, listener);
}
System.prototype.emit = function (eventType, data, cb) {
  console.log('emitted: ', eventType);
  emitter.emit(eventType, data, cb);
}
},{"events":1}],4:[function(require,module,exports){
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

},{"./EventManager":3,"./input/Terminal":10}],5:[function(require,module,exports){
const EventManager = require('./EventManager');

module.exports = Server;
function Server (socket) {
    // register receiving events
    this.socket = socket;

    // register network to events
    this.events = EventManager.register('server');

    // receiving events
    this.socket.on('connect', () => this.events.emit('server/connected', this));

    this.socket.on('player/init', (e) => this.events.emit('player/init', e));
    this.socket.on('player/update', (playerEntity) => this.events.emit('player/update', playerEntity));
    
    this.socket.on('world/init', (world) => this.events.emit('world/init', world));
    this.socket.on('world/world', (wm) => this.events.emit('world/world', wm));
    this.socket.on('world/update', (world) => this.events.emit('world/update', world));

    this.socket.on('debug/maps', (maps) => this.events.emit('debug/maps', maps));

    // outgoing events
    this.events.on('network/send', (event, data) => this.socket.emit(event, data));
    this.events.on('message', (message) => this.socket.emit('message', message));
}
},{"./EventManager":3}],6:[function(require,module,exports){
const EventManager = require('./EventManager');
const Entity = require('./entities/entity');

module.exports = Player;
function Player () {  
    this.entity;
    // register events
    this.events = EventManager.register('player');
    this.events.on('player/init', (e) => this.onReceivePlayerEntity(e));
    this.events.on('player/update', (e) => this.onReceivePlayerUpdate(e));
}
Player.prototype.get = function (name) {
  switch (name) {
    case 'entity':
      return this.entity;
    case 'regions':
      break;
  }
}
Player.prototype.onReceivePlayerEntity = function (e) {
    console.log(e);
    this.entity = new Entity(e);
}
Player.prototype.onReceivePlayerUpdate = function (e) {
    for (let prop in e) {
      this.entity[prop] = e[prop];
    }
}
},{"./EventManager":3,"./entities/entity":9}],7:[function(require,module,exports){
var view, canvas, buffer;
var lastRender = new Date();
var delta = 0;
var worldLoaded = false;
module.exports = {
  init: function (container) {
    view = new View(window.innerWidth, window.innerHeight);
    canvas = new Canvas(view.width, view.height);
    buffer = new Canvas(view.width, view.height);

    container.appendChild(canvas.element);
    return this;
  },
  get: function (type) {
    switch (type) {
      case 'view':
        return view;
      case 'canvas':
        return canvas;
      case 'buffer':
        return buffer;
      case 'delta':
        return delta;
    }
  },
  move: function (x, y) {
    // move offset relative to scale size
    // so that it doesn't become slow when
    // zoomed in
    view.offset.x -= Math.floor(x * view.zoom * view.minSize / 2);
    view.offset.y -= Math.floor(y * view.zoom * view.minSize / 2);
  },
  resize: function () {
    view.width = buffer.element.width = canvas.element.width = window.innerWidth;
    view.height = buffer.element.height = canvas.element.height = window.innerHeight;

    view.center.x = Math.floor(view.width / 2);
    view.center.y = Math.floor(view.height / 2);
  },
  render: function (state) {
    var now = new Date();
    delta = now.getTime() - lastRender.getTime();
    lastRender = now;

    // clear buffer and canvas
    buffer.clear();
    canvas.clear();

    // draw to buffer
    if (state.world) {
      buffer.drawWorldMap(state.world);
    }
    if (state.regions) {
      for (let region of state.regions) {
        region.render(buffer.ctx, view);
      }
    }
    if (state.entity) {
      view.follow(state.entity['position'].x, state.entity['position'].y, state.entity['position'].z);
      buffer.drawPlayerEntity(state.entity);
    }
    if (state.entities) {
      state.entities.forEach(function (entity) {
        entity.render(buffer.ctx, view);
      });
    }
    if (state.debug) {
      // console.log(state.debug.cells)
      if (state.debug) buffer.drawDebugMaps(state.debug)
    }

    // switch to canvas
    swap();
  }
};

function Canvas () {
  this.element = document.createElement('canvas');
  this.ctx = this.element.getContext('2d');
  this.width = this.element.width = window.innerWidth;
  this.height = this.element.height = window.innerHeight;
}
Canvas.prototype.clear = function () {
  this.ctx.clearRect(0,0, this.element.width, this.element.height);
}
Canvas.prototype.drawPlayerEntity = function (entity) {
  let canvasPosition = view.worldToCanvas(
    entity['position'].x,
    entity['position'].y,
    entity['position'].z
  );
  let widthOffset = entity['transform'].width / 2;
  this.ctx.fillStyle = 'rgba(150,150,200,.8)';
  this.ctx.fillRect(
    canvasPosition.x - view.offset.x - widthOffset, 
    canvasPosition.y - view.offset.y - entity['transform'].height, 
    entity['transform'].width, 
    entity['transform'].height
  );
}
Canvas.prototype.drawEntities = function (entities) {
  for (let e of entities) {
    let canvasPosition = view.worldToCanvas(
      e['position'].x,
      e['position'].y,
      e['position'].z
    );
    let widthOffset = e['transform'].width / 2;
    this.ctx.fillStyle = 'rgba(150,150,200,.8)';
    this.ctx.fillRect(
      canvasPosition.x - view.offset.x - widthOffset, 
      canvasPosition.y - view.offset.y - e['transform'].height, 
      e['transform'].width, 
      e['transform'].height
    );
  }
}
Canvas.prototype.drawDebugMaps = function (maps) {
  let mx = my = mz = 32;
  for (let x = 0; x < 32; x++) {
    for (let y = 0; y < 32; y++) {
      for (let z = 0; z < 32; z++) {
        let canvasPosition = view.worldToCanvas(x, y, z);
        canvasPosition.x -= view.offset.x;
        canvasPosition.y -= view.offset.y;

        let cellMap;
        for (let i = 0; i < maps.cells.length; i++) {
          if (maps.cells[i].z === z) cellMap = maps.cells[i];
        }
        if (view.isOnScreen(canvasPosition.x, canvasPosition.y) && cellMap && cellMap.values[x][y]) {
            let val = maps.temperature[x][y][z];
            let color;
            if (val < 0) color = 'rgba(0, 0, 255, ' + Math.abs(val) / 50 + ')';
            if (val >= 0) color = 'rgba(255, 0, 0, ' + val / 50 + ')';
            this.ctx.fillStyle = color;

            // console.log(color);
            // console.log(x, y, z);
            // draw bottom face
            this.ctx.beginPath();
            this.ctx.moveTo(canvasPosition.x, canvasPosition.y);
            this.ctx.lineTo(canvasPosition.x - view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
            this.ctx.lineTo(canvasPosition.x, canvasPosition.y - (view.blockSize / 2));
            this.ctx.lineTo(canvasPosition.x + view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
            this.ctx.closePath();
            this.ctx.fill();
        }
      }
    }
  }
}
Canvas.prototype.drawCellMap = function (cells) {
  let mx = my = mz = 32;
  for (let i = 0; i < 10; i++) {
    for (let x = 0; x < mx; x++) {
      for (let y = 0; y < my; y++) {
        let canvasPosition = view.worldToCanvas(x, y, cells[i].z);
        canvasPosition.x -= view.offset.x;
        canvasPosition.y -= view.offset.y;
        if (view.isOnScreen(canvasPosition.x, canvasPosition.y) && cells[i].values[x][y]) {
            this.ctx.fillStyle = 'rgba(255,255,255,.5)';

            // console.log(color);
            // console.log(x, y, z);
            // draw bottom face
            this.ctx.beginPath();
            this.ctx.moveTo(canvasPosition.x, canvasPosition.y);
            this.ctx.lineTo(canvasPosition.x - view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
            this.ctx.lineTo(canvasPosition.x, canvasPosition.y - (view.blockSize / 2));
            this.ctx.lineTo(canvasPosition.x + view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
            this.ctx.closePath();
            this.ctx.fill();
        }
      }
    }
  }
}
Canvas.prototype.drawWorldMap = function (wm) {
  let mx = my = mz = wm.length;
  for (let x = 0; x < mx; x++) {
    for (let y = 0; y < my; y++) {
      for (let z = 0; z < mz; z++) {
          let canvasPosition = view.worldToCanvas(x, y, z);
          canvasPosition.x -= view.offset.x;
          canvasPosition.y -= view.offset.y;
        if (
          view.isOnScreen(canvasPosition.x, canvasPosition.y)
          && (z == mx - 1 || y == mx - 1 || x == mx - 1) // if any position is toward cam
          ) {
            let val = wm[x][y][z];
            let color;
            if (val < 0) color = 'rgba(0, 0, 255, ' + Math.abs(val) / 50 + ')';
            if (val >= 0) color = 'rgba(255, 0, 0, ' + val / 50 + ')';
            this.ctx.fillStyle = color;

            // console.log(color);
            // console.log(x, y, z);
            // draw bottom face
            this.ctx.beginPath();
            this.ctx.moveTo(canvasPosition.x, canvasPosition.y);
            this.ctx.lineTo(canvasPosition.x - view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
            this.ctx.lineTo(canvasPosition.x, canvasPosition.y - (view.blockSize / 2));
            this.ctx.lineTo(canvasPosition.x + view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
            this.ctx.closePath();
            this.ctx.fill();
        }
      }
    }
  }
}

function View (width, height) {
  this.top = 0;
  this.left = 0;
  this.width = width;
  this.height = height;
  this.center = {
    x: Math.floor(this.width / 2),
    y: Math.floor(this.height /2)
  }
  this.offset = {
    x: 0,
    y: 0
  };
  this.zoom = 1;
  this.minSize = 12;
  this.blockSize = 32;
}
View.prototype.follow = function(x, y, z) {
  let position = view.worldToCanvas(x, y, z);
  this.centerOn(position.x, position.y);
}
View.prototype.centerOn = function (x, y) {
  this.offset.x = x - this.center.x;
  this.offset.y = y - this.center.y;
}
View.prototype.isOnScreen = function (x, y) {
  // takes canvas positions and sees whether it's in view
  return  x + view.blockSize >= view.left 
          && x - view.blockSize <= view.left + view.width
          && y + view.blockSize >= view.top 
          && y - view.blockSize <= view.top + view.height;
}
View.prototype.isObscured = function (bx, by, bz, maxX, maxY, maxZ, position) {
  // check if there are any blocks directly
  // infront of this from the viewport perspective
  var offsetX = bx + 1;
  var offsetY = by + 1;
  var offsetZ = bz + 1;
  var viewportVisible = true;
  for (var i = 0; offsetX < maxX && offsetY < maxY && offsetZ < maxZ; i++) {
    var block = position[offsetX][offsetY][offsetZ].block;
    if (block !== null) {
      viewportVisible = false;
      break;
    }
    offsetX++;
    offsetY++;
    offsetZ++;
  }

  // check if all neighbours are covering
  // all of this blocks faces
  var neighbourX = bx + 1;
  var neighbourY = by + 1;
  var neighbourZ = bz + 1;
  var faceVisible = true;
  if (
    neighbourX < maxX && 
    neighbourY < maxY && 
    neighbourZ < maxZ &&
    position[neighbourX][by][bz].block !== null &&
    position[bx][neighbourY][bz].block !== null &&
    position[bx][by][neighbourZ].block !== null)
  {
    faceVisisble = false;
  }
  
  // if (bx % 10 === 0 && by % 10 === 0 ) console.log(viewportVisible, faceVisible);
  return viewportVisible && faceVisible;
}
View.prototype.worldToCanvas = function (wx, wy, wz) {
  var cx = ((wx - wy) * view.blockSize / 2);
  var cy = ((wy + wx) * view.blockSize / 4) - (wz * view.blockSize / 2);
  
  // if (position.x % 10 === 0 && position.y % 10 === 0) console.log(position, blockX, blockY, blockZ);
  return {
    x: cx,
    y: cy
  }
}
View.prototype.canvasToWorld = function (canvasPosition) {
  // return world position in center of viewport
  var x = ((canvasPosition.x + canvasPosition.y) * 2 / view.blockSize);
  var y = ((canvasPosition.y - canvasPosition.x) * 4 / view.blockSize);
  
  // if (canvasPosition.x % 10 === 0 && canvasPosition.y % 10 === 0) console.log(x, y);
  return {
    x: Math.floor(x),
    y: Math.floor(y),
  }
}

function swap () {
  // cut the drawn rectangle
  var image = buffer.ctx.getImageData(view.left, view.top, view.width, view.height);
  // copy into visual canvas at different position
  canvas.ctx.putImageData(image, 0, 0);
}

function OLD (world) {
  // have to do translations
  // canvas x, y will be relative to blockSize, scale, center of screen x,y
  for (var x = 0; x < world.x; x++) {
    for (var y = 0; y < world.y; y++) {
      for (var z = 0; z < world.z; z++) {
        // var block = world.regions[x][y][z].block;
        // if (block) {
          var canvasPosition = view.worldToCanvas(world.regions[x][y][z].position);

          // adjust offset of viewport
          canvasPosition.x -= view.offset.x;
          canvasPosition.y -= view.offset.y;

          // if (x % 10 === 0 && y % 10 === 0) console.log(position, world.regions[x][y][z], view, view.center);
          if (
              inViewport(canvasPosition.x, canvasPosition.y - canvasPosition.z) 
              && isBlockVisible(x, y, z, world.x, world.y, world.z, world.regions)
            )
            drawBlock(canvasPosition.x, canvasPosition.y - canvasPosition.z, z, block, .99);
        // }
      }
    }
  }
  // if (!worldLoaded) worldLoaded = true;
}

},{}],8:[function(require,module,exports){
const EventManager = require('./EventManager');

module.exports = World;
function World (w) {
  this.createdAt = w.createdAt;
  this.cycle = w.cycle;
  this.scale = w.scale;
  this.seed = w.seed;
  this.x = w.x;
  this.y = w.y;
  this.z = w.z;
  this.center = w.center;
  this.regions = w.regions;
  this.regionSize = w.regionSize;
  this.chunkSize = w.chunkSize;
  this.lastEvent = Date.now();

  // world data
  this.entities = w.entities;
  this.debug = {
    cells: [],
    temperature: []
  };
  this.maps = {
    world: [],
    region: [],
    area: [],
    location: []
  };
  this.regions = w.regions;

  // register events
  this.events = EventManager.register('world');
  this.events.on('world/world', (wm) => this.onReceiveWorld(wm));
  this.events.on('world/region', (region) => this.onReceiveRegion(region));
  this.events.on('world/area', (area) => this.onReceiveArea(area));
  this.events.on('world/location', (location) => this.onReceiveLocation(location));
  this.events.on('debug/maps', (maps) => this.onReceiveDebugMaps(maps));
}

World.prototype.cache = function (type, data) {
  switch (type) {
    case 'regions':
      this.regions = data;
      break;
  }
}
World.prototype.get = function (name) {
  switch (name) {
    case 'world':
      return this.maps.world;
    case 'debug':
      return this.debug.maps;
  }
}
World.prototype.onReceiveDebugMaps = function (maps) {
  this.debug.maps = maps;
}
World.prototype.onReceiveWorld = function (wm) {
  this.maps.world = wm;
}
World.prototype.onReceiveRegion = function (region) {}
World.prototype.onReceiveArea = function (area) {}
World.prototype.onReceiveLocation = function (location) {}
},{"./EventManager":3}],9:[function(require,module,exports){
module.exports = function Entity() {};
},{}],10:[function(require,module,exports){
module.exports = Terminal;
function Terminal (id, events) {
  this.element = document.querySelector(id);
  this.historyIndex = -1;
  this.history = [];

  // hook into input events
  this.events = events;
}
Terminal.prototype.focus = function () {
  this.element.focus();
}
Terminal.prototype.prevHistory = function () {
  if (this.history.length > 0 && this.historyIndex < this.history.length - 1) {
    this.historyIndex++;
    this.element.value = this.history[this.historyIndex];
  }
}
Terminal.prototype.nextHistory = function () {
  if (this.history.length > 0 && this.historyIndex > -1) {
    this.historyIndex--;
    if (this.historyIndex === -1) {
      this.element.value = '';
    } else {
      this.element.value = this.history[this.historyIndex];
    }

    // set caret at the end of line
    // strange hack for chrome
    setTimeout(() => { this.element.value = this.element.value; }, 0);
  }
}
Terminal.prototype.submit = function () {
  input = this.element.value;
  
  // check if input is not empty
  if (input !== '') {
    // update terminal history if it's not the same
    // as last input
    if (this.history[0] !== input) {
      this.history.unshift(input);
    }
    // console.log(terminalHistory, historyIndex);
    this.historyIndex = -1;
    console.log(input);
    this.events.emit('message', input);

    this.element.value = '';
  }
}

},{}],11:[function(require,module,exports){
// Reverie client
// Created by Jonathon Orsi
const EventManager = require('./EventManager');
const InputManager = require('./InputManager');

const Player = require('./Player');
const World = require('./World');
const Network = require('./Network');
const Renderer = require('./Renderer');
const Debug = require('./Debug');

debug = true;
function ReverieClient (env) {
  this.env = env || {};
  this.world;
  this.server;
  this.player = new Player();

  // init socket.io and network
  let socket = io();
  this.Network = new Network(socket);

  // init Input
  this.InputManager = new InputManager();

  // init Renderer
  this.Renderer = Renderer.init(document.querySelector('#reverie'));

  // debugger
  if (debug) this.Debug = Debug.init();

  // register events
  this.events = EventManager.register('reverie');
  this.events.on('server/connect', (server) => {
    this.server = server;
  });
  this.events.on('world/init', (world) => {
    this.world = new World(world);
  });


  this.update();
}
ReverieClient.prototype.update = function () {
  if(this.player && this.world) {
    this.Renderer.render({
      entity: this.player.get('entity'),
      world: this.world.get('world'),
      debug: this.world.get('debug')
    });
    if (this.Debug) {
      this.Debug.output({
        delta: this.Renderer.get('delta'),
        view: this.Renderer.get('view'),
        world: this.world.get('world'),
        entity: this.player.get('entity')
      })
    }
  }
  requestAnimationFrame(() => this.update());
}

// init ReverieClient
let reverie = new ReverieClient();

},{"./Debug":2,"./EventManager":3,"./InputManager":4,"./Network":5,"./Player":6,"./Renderer":7,"./World":8}]},{},[11]);
