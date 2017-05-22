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
const EventManager = require('./EventManager');
var Entity = require('../shared/Entity');
var entity;

module.exports = {
    init: function () {
        events = EventManager.register('world');

        events.on('network:entity', (e) => {
            entity = Entity.clone(e);
        });
    },
    get: function () {
        return entity;
    }
}
},{"../shared/Entity":11,"./EventManager":3}],3:[function(require,module,exports){
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

    console.log(systems);
    
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
  if (eventType === 'world') console.log('world received from ' + this.name, data, cb);
  emitter.emit(this.name + ':' + eventType, data, cb);
}
},{"events":1}],4:[function(require,module,exports){
var EventManager = require('./EventManager');
var events;
var Renderer = require('./Renderer');
var canvas = Renderer;
var Terminal = require('./input/Terminal');
var World = require('./World')

var terminal; 
module.exports = {
  init: function () {
    events = EventManager.register('input');
    terminal = Terminal.create('#terminal', events);

    window.addEventListener('resize', canvas.resize);

    // IE9, Chrome, Safari, Opera
    window.addEventListener("wheel", Input.onMouseWheel, false);

    // remove context menu
    window.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    // mouse events
    window.addEventListener('mousedown', Input.onMouseEvent);
    window.addEventListener('mouseup', Input.onMouseEvent);
    window.addEventListener('mousemove', Input.onMouseEvent)

    // keyboard events
    document.addEventListener('keydown', Input.onKeyDown);
    document.addEventListener('keyup', Input.onKeyUp);
    document.addEventListener('keypress', Input.onKeyPress);
  },
};

var Input = {};

Input.mouseInterval = null;
Input.onMouseWheel = function (e) {
  if (e.deltaY < 0) {
    World.trigger('zoomIn');
  } else {
    World.trigger('zoomOut');
  }
}
Input.onMouseEvent = function (e) {
  // call function for which buttons and movement
  switch (e.type) {
    case 'mousemove':
      Input.onMouseMove(e);
      break;
    case 'mouseup':
      clearInterval(Input.mouseInterval);
      break;
    case 'mousedown':
      if(e.button === 2) Input.mouseInterval = setInterval(function () { Input.onMouseRight(e) }, 25);
      break;
  }
}

Input.mouseLocation = '';
Input.onMouseMove = function (e) {
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
    Input.mouseLocation = 'topLeft';
  } else if (topCenter) {
    Input.mouseLocation = 'topCenter';
  } else if (topRight) {
    Input.mouseLocation = 'topRight';
  } else if (centerLeft) {
    Input.mouseLocation = 'centerLeft';
  } else if (centerCenter) {
    Input.mouseLocation = 'centerCenter';
  } else if (centerRight) {
    Input.mouseLocation = 'centerRight';
  } else if (bottomLeft) {
    Input.mouseLocation = 'bottomLeft';
  } else if (bottomCenter) {
    Input.mouseLocation = 'bottomCenter';
  } else if (bottomRight) {
    Input.mouseLocation = 'bottomRight';
  }
}
var scrollSpeed = 1;
Input.onMouseRight = function (e) {
  switch (Input.mouseLocation) {
    case 'topLeft':
      canvas.move(scrollSpeed, scrollSpeed);
      break;
    case 'topCenter':
      canvas.move(0, scrollSpeed);
      break;
    case 'topRight':
      canvas.move(-scrollSpeed, scrollSpeed);
      break;
    case 'centerLeft':
      canvas.move(scrollSpeed, 0);
      break;
    case 'centerCenter':
      break;
    case 'centerRight':
    canvas.move(-scrollSpeed, 0);
      break;
    case 'bottomLeft':
      canvas.move(scrollSpeed, -scrollSpeed);
      break;
    case 'bottomCenter':
      canvas.move(0, -scrollSpeed);
      break;
    case 'bottomRight':
      canvas.move(-scrollSpeed, -scrollSpeed);
      break;
  }
}

Input.onKeyDown = function (e) {
  terminal.focus();
  switch (e.key) {
    case 'ArrowUp':
      terminal.prevHistory();
      break;
    case 'ArrowDown':
      terminal.nextHistory();
      break;
    case 'Enter':
      terminal.submit();
      break;
  }
}
Input.onKeyUp = function (w) {}
Input.onKeyPress = function (e) {}

},{"./EventManager":3,"./Renderer":6,"./World":7,"./input/Terminal":8}],5:[function(require,module,exports){
var server;
module.exports = {
  init: function (socket) {
    var events = EventManager.register('network');
    server = new Server(socket, events);
  },
  send: function (type, data) {
    switch (type) {
      case 'message':
        server.sendMessage(data);
        break;
    }
  }
}

// imports
var EventManager = require('./EventManager');
// var Canvas = require('./Renderer');
// var World = require('./World');

function Server (socket, events) {
    // register receiving events
    this.socket = socket;
    this.events = events;

    // recieved events from server
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.socket.on('entity', (e) => {
      this.events.emit('entity', e);
    });
    this.socket.on('world', (w) => {
      this.events.emit('world', w);
    });
    // this.socket.on('world:created', (world) => {
    //   this.events.emit('world', world);
    // });
    // this.socket.on('world:generated', (regions) => {
    //   console.log(regions);
    //   this.events.emit('regions', regions);
    // });

    // events from systems to server
    this.events.on('input:message', (message) => {
      this.socket.emit('message', message, () => {

      });
    });
    // socket.on('network:world:initialized', (character, world, entities) => {
    //   console.dir(world);
    //   console.dir(character);
    //   World.setCharacter(character);
    //   World.setWorld(world);
    //   World.setEntities(entities);
    // });
}

Server.prototype.newMessage = function (message) {}
Server.prototype.sendMessage = function (message) {
}
},{"./EventManager":3}],6:[function(require,module,exports){
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
    view.moveToCenter();
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
      world.render(buffer);
    }
    if (state.regions) {
      for (let region of state.regions) {
        region.render(buffer);
      }
    }
    if (state.entity) {
      state.entity.components[render](buffer);
    }
    if (state.entities) {
      state.entities.forEach(function (entity) {
        entity.components[render](buffer);
      });
    }
    if (state.debug) {
      drawDebugToBuffer(state.debug);
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

function View (width, height) {
  this.top = 0;
  this.left = 0;
  this.width = width;
  this.height = height;
  this.center = {
    x: Math.floor(width / 2),
    y: Math.floor(height /2)
  }
  this.offset = {
    x: 0,
    y: 0
  };
  this.zoom = 1;
  this.minSize = 12;
  this.blockSize = 12;
}
View.prototype.moveToCenter = function () {
  this.offset.x = -this.center.x;
  this.offset.y = -this.center.y;
}
View.prototype.isVisible = function (x, y) {
  return  x + view.blockSize >= view.left 
          && x - view.blockSize <= view.left + view.width
          && y + view.blockSize >= view.top 
          && y - view.blockSize <= view.top + view.height;
}

function swap () {
  // cut the drawn rectangle
  var image = buffer.ctx.getImageData(view.left, view.top, view.width, view.height);
  // copy into visual canvas at different position
  canvas.ctx.putImageData(image, 0, 0);
}
function worldToCanvas (worldPosition) {
  var x = ((worldPosition.x - worldPosition.y) * view.blockSize / 2);
  var y = ((worldPosition.y + worldPosition.x) * view.blockSize / 4);
  var z = worldPosition.z * view.blockSize / 2;
  
  // if (position.x % 10 === 0 && position.y % 10 === 0) console.log(position, blockX, blockY, blockZ);
  return {
    x: x,
    y: y,
    z: z
  }
}
function canvasToWorld (canvasPosition) {
  // return world position in center of viewport
  var x = ((canvasPosition.x + canvasPosition.y) * 2 / view.blockSize);
  var y = ((canvasPosition.y - canvasPosition.x) * 4 / view.blockSize);
  
  // if (canvasPosition.x % 10 === 0 && canvasPosition.y % 10 === 0) console.log(x, y);
  return {
    x: Math.floor(x),
    y: Math.floor(y),
  }
}
function isBlockVisible (bx, by, bz, maxX, maxY, maxZ, position) {
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

function drawWorldToBufferOLD (world) {
  // have to do translations
  // canvas x, y will be relative to blockSize, scale, center of screen x,y
  for (var x = 0; x < world.x; x++) {
    for (var y = 0; y < world.y; y++) {
      for (var z = 0; z < world.z; z++) {
        var block = world.regions[x][y][z].block;
        if (block) {
          var canvasPosition = worldToCanvas(world.regions[x][y][z].position);

          // adjust offset of viewport
          canvasPosition.x -= view.offset.x;
          canvasPosition.y -= view.offset.y;

          // if (x % 10 === 0 && y % 10 === 0) console.log(position, world.regions[x][y][z], view, view.center);
          if (
              inViewport(canvasPosition.x, canvasPosition.y - canvasPosition.z) 
              && isBlockVisible(x, y, z, world.x, world.y, world.z, world.regions)
            )
            drawBlock(canvasPosition.x, canvasPosition.y - canvasPosition.z, z, block, .99);
        }
      }
    }
  }
  if (!worldLoaded) worldLoaded = true;
}

function drawDebug (debug) {
    buffer.ctx.font = '14px Courier';
    buffer.ctx.fillStyle = 'white';

    // canvas info
    buffer.ctx.fillText(Math.floor((1000 / delta)) + 'fps', 10, 20);
    buffer.ctx.fillText('viewport', 10, 40);
    buffer.ctx.fillText('left: ' + view.left, 20, 60);
    buffer.ctx.fillText('top: ' + view.top, 20, 80);
    buffer.ctx.fillText('width: ' + view.width, 20, 100);
    buffer.ctx.fillText('height: ' + view.height, 20, 120);
    buffer.ctx.fillText('centerX: ' + view.center.x, 20, 140);
    buffer.ctx.fillText('centerY: ' + view.center.y, 20, 160);
    buffer.ctx.fillText('offsetX: ' + view.offset.x + ', offsetY: ' + view.offset.y, 20, 180);
    buffer.ctx.fillText('blockSize: ' + view.blockSize, 20, 200);

    // world info
    if (debug.world) {
      buffer.ctx.fillText('world', 10, 320);
      buffer.ctx.fillText('x: ' + debug.world.x, 20, 340);
      buffer.ctx.fillText('y: ' + debug.world.y, 20, 360);
      buffer.ctx.fillText('z: ' + debug.world.z, 20, 380);
      buffer.ctx.fillText('centerX: ' + Math.round(debug.world.x / 2), 20, 400);
      buffer.ctx.fillText('centerY: ' + Math.round(debug.world.y / 2), 20, 420);
      buffer.ctx.fillText('regions: ' + debug.world.regions.length, 20, 440);
      var currentCenter = {
        x: view.offset.x + view.center.x,
        y: view.offset.y + view.center.y
      };
      var worldLocation = canvasToWorld(currentCenter);
      buffer.ctx.fillText('overworld x: ' + worldLocation.x, 20, 460);
      buffer.ctx.fillText('overworld y: ' + worldLocation.y, 20, 480);
    }

    // entity info
    if (debug.entity) {
      var entity = debug.entity;
      buffer.ctx.fillText('entity', view.width - 300, 20);
      buffer.ctx.fillText('zoom: ' + entity.get('position').zoom,  view.width - 300, 40);
      // buffer.ctx.fillText('x: ' + debug.world.x, 20, 340);
      // buffer.ctx.fillText('y: ' + debug.world.y, 20, 360);
      // buffer.ctx.fillText('z: ' + debug.world.z, 20, 380);
      // buffer.ctx.fillText('centerX: ' + Math.round(debug.world.x / 2), 20, 400);
      // buffer.ctx.fillText('centerY: ' + Math.round(debug.world.y / 2), 20, 420);
      // buffer.ctx.fillText('regions: ' + debug.world.regions.length, 20, 440);
      // var currentCenter = {
      //   x: view.offset.x + view.center.x,
      //   y: view.offset.y + view.center.y
      // };
      // var worldLocation = canvasToWorld(currentCenter);
      // buffer.ctx.fillText('overworld x: ' + worldLocation.x, 20, 460);
      // buffer.ctx.fillText('overworld y: ' + worldLocation.y, 20, 480);
      // buffer.ctx.fillText('scale: ' + debug.world.scale, 20, 500);
    }
}


},{}],7:[function(require,module,exports){
var EventManager = require('./EventManager');
var events;

var world;
var lastEvent = Date.now();
module.exports = {
  init: function () {
    events = EventManager.register('world');

    // register events
    events.on('network:world', (w) => {
      world = new World(w);
    });
  },
  exists: function () {
    return (world !== null);
  },
  get: function (type) {
    var data = null;
    switch (type) {
      case 'world':
        data = world;
        break;
      case 'entity':
        data = entity;
        break;
    }
    return data;
  },
  trigger: function (event) {
    var currentTime = Date.now();
    if (currentTime - lastEvent > 100) {
      switch (event) {
        case 'zoomIn':
          var originalScale = world.scale;
          world.scale = parseFloat((world.scale + 0.1).toFixed(1));
          if (world.scale > 15) world.scale = 15;
          Network.send('world:scale', world.scale, (err) => {
            if (err) world.scale = originalScale;
          });
          break;
        case 'zoomOut':
          var originalScale = world.scale;
          world.scale = parseFloat((world.scale - 0.1).toFixed(1));
          if (world.scale < 1) world.scale = 1;
          Network.send('world:scale', world.scale, (err) => {
            if (err) world.scale = originalScale;
          });
          break;
      }

      lastEvent = currentTime;
    }
  },
  getNeighbours: function (mapX, mapY) {
    var neighbours = {
      north: map[mapX][mapY - 1],
      northEast: map[mapX + 1][mapY - 1],
      east: map[mapX + 1][mapY],
      southEast: map[mapX + 1][mapY + 1],
      south: map[mapX][mapY + 1],
      southWest: map[mapX - 1][mapY + 1],
      west: map[mapX - 1][mapY],
      northWest: map[mapX - 1][mapY - 1],
    };
    return neighbours;
  }
}

// imports
var Network = require('./Network');

var _chunk;
var _entities;
var world = null;



function World (world) {
  this.createdAt = world.createdAt;
  this.cycle = world.cycle;
  this.scale = world.scale;
  this.seed = world.seed;
  this.x = world.x;
  this.y = world.y;
  this.z = world.z;
  this.center = world.center;
  this.regionSize = world.regionSize;
  this.chunkSize = world.chunkSize;

  // world data
  this.entities = world.entities;
  this.regions = world.regions;
}

World.prototype.cache = function (type, data) {
  switch (type) {
    case 'regions':
      this.regions = data;
      break;
  }
}
},{"./EventManager":3,"./Network":5}],8:[function(require,module,exports){
module.exports = {
  create: function (id, events) {
    return new Terminal(id, events);
  }
};

function Terminal (id, events) {
  this.element = document.querySelector(id);
  this.events = events;
}
Terminal.prototype.focus = function () {
  this.element.focus();
}
var historyIndex = -1;
var terminalHistory = [];
Terminal.prototype.prevHistory = function () {
  if (terminalHistory.length > 0 && historyIndex < terminalHistory.length - 1) {
    historyIndex++;
    this.element.value = terminalHistory[historyIndex];
  }
}
Terminal.prototype.nextHistory = function () {
  if (terminalHistory.length > 0 && historyIndex > -1) {
    historyIndex--;
    if (historyIndex === -1) {
      this.element.value = '';
    } else {
      this.element.value = terminalHistory[historyIndex];
    }

    // set caret at the end of line
    // strange hack for chrome
    var that = this;
    setTimeout(function () { that.element.value = that.element.value; }, 0);
  }
}
Terminal.prototype.submit = function () {
  input = this.element.value;
  
  // check if input is not empty
  if (input !== '') {
    // update terminal history if it's not the same
    // as last input
    if (terminalHistory[0] !== input) {
      terminalHistory.unshift(input);
    }
    // console.log(terminalHistory, historyIndex);
    historyIndex = -1;

    this.events.emit('message', input);

    this.element.value = '';
  }
}

},{}],9:[function(require,module,exports){
// Reverie client
// Created by Jonathon Orsi
const Renderer = require('./Renderer');
const World = require('./World');
const Entity = require('./Entity');
const Input = require('./Input');
const Network = require('./Network');

// init socket.io
Network.init(io());

// init Input
Input.init();

// init Renderer
Renderer.init(document.querySelector('#reverie'));

// init World
World.init();

// init Entity
Entity.init();

// start update loop
function update() {
  Renderer.render({
    entity: Entity.get('entity'),
    world: World.get('world'),
    debug: {
      world: World.get('world'),
      entity: Entity.get('entity')
    },
  });
  requestAnimationFrame(update);
}
update();

},{"./Entity":2,"./Input":4,"./Network":5,"./Renderer":6,"./World":7}],10:[function(require,module,exports){
let components = {};
module.exports = {
  register: function (componentName, component) {
    // registers a new named component
    // and can provide an object or function as
    // the component

    // check if component name already exists
    if (components[componentName] !== undefined) {
      return;
    }

    // create component entry with properties,
    // and an array of entities registered to that
    // component
    components[componentName] = {
      component: component,
      entities: []
    };
  },
  add: function (componentName, entity) {
    // make sure component is registered first
    if (components[componentName] === undefined) {
      return;
    }

    let component = components[componentName];
    
    // make sure entity doesn't already have component
    if (entity.has(componentName)) {
      return;
    }
    // create component on entity
    entity.components[componentName] = new Component(component.component);

    // add entity to component entity list
    if (component.entities.indexOf(entity) > -1) {
      return;
    }
    component.entities.push(entity);

    return entity;
  },
  getEntitiesWith: function (componentName) {
    // check if component exists
    if (!components[componentName]) return;
    return components[componentName].entities;
  }
}

function Component (component) {
  if (typeof component === 'function') {
    return component;
  } else if (typeof component === 'object') {
    var obj = {};
    for (let property in component) {
      obj[property] = component[property];
    }
    return obj;
  }
}
},{}],11:[function(require,module,exports){
var Component = require('../shared/Component');

let types = {};
let entities = [];
module.exports = {
  register: function (entityName, components) {
    // registers a new type of entity
    // with an array of components to add
    // to it when created

    if (types[entityName] !== undefined) {
      // already registered
      return;
    }

    types[entityName] = components;
  },
  create: function (type) {
    // check if entity type exists
    let components = types[type];
    if (!components) return;
    
    // creates a new entity of the type
    // and adds all of its components
    let entity = new Entity(type);

    components.forEach(function (componentName) {
      entity.add(componentName);
    });

    // add to entities list
    entities.push(entity);
    
    return entity;
  },
  remove: function (entity) {
    for (var i = 0; i < entities.length; i++) {
      if (entity === entities[i]) {
        entities.splice(i, 1);
        break;
      }
    }
  },
  clone: function (e) {
    // recreate entity from data
    let entity = new Entity(e.type);
    entity.id = e.id;
    
    // add each component to entity
    for (let component in e.components) {
      entity.components[component] = e.components[component];
    }
    
    return entity;
  }
}

var id = 0;
function Entity (type) {
  this.type = type;
  this.id = ++id;
	this.components = {};
}
Entity.prototype.has = function (componentName) {
  return this.components[componentName] !== undefined;
}
Entity.prototype.get = function (componentName) {
  return this.components[componentName];
}
Entity.prototype.add = function (componentName) {
  Component.add(componentName, this);
}
Entity.prototype.remove = function (componentName) {
  delete this.components[componentName];
}

},{"../shared/Component":10}]},{},[9]);
