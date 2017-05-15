(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Canvas = require('../renderer/canvas'),
    Terminal = require('../input/terminal');

module.exports = Input = function () {
  window.addEventListener('resize', Canvas.resize);

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

  return this;
}

Input.mouseInterval = null;
Input.onMouseWheel = function (e) {
  if (e.deltaY < 0) {
    Canvas.increaseWorldScale();
  } else {
    Canvas.decreaseWorldScale();
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
      Canvas.move(scrollSpeed, scrollSpeed);
      break;
    case 'topCenter':
      Canvas.move(0, scrollSpeed);
      break;
    case 'topRight':
      Canvas.move(-scrollSpeed, scrollSpeed);
      break;
    case 'centerLeft':
      Canvas.move(scrollSpeed, 0);
      break;
    case 'centerCenter':
      break;
    case 'centerRight':
    Canvas.move(-scrollSpeed, 0);
      break;
    case 'bottomLeft':
      Canvas.move(scrollSpeed, -scrollSpeed);
      break;
    case 'bottomCenter':
      Canvas.move(0, -scrollSpeed);
      break;
    case 'bottomRight':
      Canvas.move(-scrollSpeed, -scrollSpeed);
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

},{"../input/terminal":2,"../renderer/canvas":5}],2:[function(require,module,exports){
// imports
var Canvas = require('../renderer/canvas'),
    Sockets = require('../network/sockets');

var terminal;
module.exports = Terminal = function (t) {
  terminal = t;

  return this;
}
Terminal.focus = function () {
  terminal.focus();
}
var historyIndex = -1;
var terminalHistory = [];
Terminal.prevHistory = function () {
  historyIndex++;
  if (historyIndex > terminalHistory.length - 1) historyIndex = terminalHistory.length - 1;
}
Terminal.nextHistory = function () {
  historyIndex--;
  if (historyIndex < -1) historyIndex = -1;
  if (historyIndex === -1) {
    terminal.value = '';
  } else {
    terminal.value = terminalHistory[historyIndex];
  }

  // set caret at the end of line
  // strange hack for chrome
  setTimeout(function () { terminal.value = terminal.value; }, 0);
}
Terminal.submit = function () {
  input = terminal.value;
  // save input to terminal history if it's the same as last
  console.log(terminalHistory, historyIndex);
  if (terminalHistory[historyIndex] !== input) {
    terminalHistory.unshift(input);
  }
  historyIndex = -1;

  // parse input to see if it is a command or a simple message
  var parsedInput = input.split(' ');
  var isCommand = parsedInput[0].startsWith('/');

  // if it is a command, find out which command it is, and then see if there are arguments
  if (isCommand) {
    var command = parsedInput.shift().substring(1); // remove forward slash
    // send commands to server
    switch (command) {
      case 'create':
        // create command takes a series of arguments
        var args = {};
        for (var i = 0; i < parsedInput.length; i++) {
          var argument = parsedInput[i].split('=');
          var key = argument[0];
          var value = argument[1];
          switch (key) {
            case 'x':
            case 'y':
            case 'steps':
              value = parseInt(value);
              break;
            case 'alivePercent':
              value = parseFloat(value);
              break;
            case 'birth':
            case 'survival':
              value = value.split(',');
              for (var j = 0; j < value.length; j++) {
                value[j] = parseInt(value[j]);
              }
              break;
            default:
              break;
          }
          args[key] = value;
        }

        // send
        Sockets.sendWorldCreateCommand();
        break;
      case 'step':
        // send
        Sockets.sendWorldStepCommand();
        break;
      default:
        console.log('unknown command: ', command);
        break;
    }
  } else { // send input to server as message
    console.log('message: ', input);
  }

  terminal.value = '';
}

},{"../network/sockets":4,"../renderer/canvas":5}],3:[function(require,module,exports){
// Reverie client
// Created by Jonathon Orsi
var Canvas = require('./renderer/canvas');
var World = require('./world/world');

module.exports = Reverie = {};

Reverie.dom = {
  terminal: document.querySelector('#terminal'),
  cursor: document.querySelector('cursor')
}
Reverie.input = require('./input/input')();
Reverie.terminal = require('./input/terminal')(Reverie.dom.terminal);
Reverie.sockets = require('./network/sockets');
Reverie.sockets.init(io());

Reverie.canvas = Canvas;
Reverie.canvas.moveOffsetTo(-Reverie.canvas.viewport.center.x, -Reverie.canvas.viewport.center.y);
Reverie.container = document.querySelector('#reverie');
Reverie.container.appendChild(Reverie.canvas.canvas);

Reverie.world = require('./world/world');

// start animation loop
function canvasLoop() {
  if (Reverie.world.getWorld()) {
      Reverie.canvas.render({
        character: Reverie.world.getCharacter(),
        world: Reverie.world.getWorld(),
        entities: Reverie.world.getEntities()
      });
  }
  requestAnimationFrame(canvasLoop);
}
canvasLoop();

},{"./input/input":1,"./input/terminal":2,"./network/sockets":4,"./renderer/canvas":5,"./world/world":6}],4:[function(require,module,exports){
// imports
var Canvas = require('../renderer/canvas');
var World = require('../world/world');

module.exports = {
  init: function (socket) {
    socket.on('world:init', onWorldData);
    socket.on('actor connected', createActor);
    socket.on('newMessage', newMessage);
  }
}
function onWorldData(character, world, entities) {
  console.dir(world);
  console.dir(character);
  World.setCharacter(character);
  World.setWorld(world);
  World.setEntities(entities);
}
function newMessage(message) {
}
// functions
function createActor(actor) {
  // var $actor = document.createElement('actor');
  // $actor.style.color = actor.color;
  // $actor.style.position = 'absolute';
  // $actor.style.top = actor.y;
  // $actor.style.left = actor.x;
  // $actor.appendChild(document.createTextNode(actor.symbol));
  // world.appendChild($actor);
}
function sendWorldCreateCommand() {
  sockets.emit('world create', args, function (response, world) {
    if (response) Canvas.renderWorld(world);
  });
}
function onMessage(response, message) {
  console.log(response, message);
  // if (response) {
  //   var $actor = document.querySelector('actor');
  //   var $speech = document.querySelector('actor > p');
  //   console.dir($speech);
  //   if (!$speech) {
  //     var $speech = document.createElement('p');
  //     $speech.style.position = 'absolute';
  //     $speech.style.top = '-100%';
  //     $speech.style.margin = 0;
  //     $speech.appendChild(document.createTextNode(''));
  //     $actor.appendChild($speech);
  //   }
  //   $speech.childNodes[0].nodeValue = message.text;
  // }
}
function sendWorldStepCommand() {
  sockets.emit('world step', null, function (response, world) {
    if (response) Canvas.renderWorld(world);
  });
}

},{"../renderer/canvas":5,"../world/world":6}],5:[function(require,module,exports){
var Canvas = {}
Canvas.canvas = document.createElement('canvas');
Canvas.ctx = Canvas.canvas.getContext('2d');
Canvas.buff = document.createElement('canvas');
Canvas.buffer = Canvas.buff.getContext('2d');
Canvas.width = Canvas.buff.width = Canvas.canvas.width = window.innerWidth;
Canvas.height = Canvas.buff.height = Canvas.canvas.height = window.innerHeight;
Canvas.minSize = 12;
Canvas.blockSize = 12;
Canvas.offset = {
  x: 0,
  y: 0
};
Canvas.scale = 1;
Canvas.viewport = {
  top: 0,
  left: 0,
  width: Canvas.width,
  height: Canvas.height,
  center: {
    x: Math.floor(Canvas.width / 2),
    y: Math.floor(Canvas.height / 2)
  }
}
Canvas.worldLoaded = false;
module.exports = Canvas;

Canvas.move = function (x, y) {
  // move offset relative to scale size
  // so that it doesn't become slow when
  // zoomed in
  Canvas.offset.x -= Math.floor(x * Canvas.scale * Canvas.minSize / 2);
  Canvas.offset.y -= Math.floor(y * Canvas.scale * Canvas.minSize / 2);
}
Canvas.moveOffsetTo = function (x, y) {
  Canvas.offset.x = x;
  Canvas.offset.y = y;
}
Canvas.resize = function () {
  Canvas.viewport.width = Canvas.buff.width = Canvas.canvas.width = window.innerWidth;
  Canvas.viewport.height = Canvas.buff.height = Canvas.canvas.height = window.innerHeight;

  Canvas.viewport.center.x = Math.floor(Canvas.viewport.width / 2);
  Canvas.viewport.center.y = Math.floor(Canvas.viewport.height / 2);
}
Canvas.increaseWorldScale = function () {
  Canvas.scale = parseFloat((Canvas.scale + 0.1).toFixed(1));
  if (Canvas.scale > 15) Canvas.scale = 15;

  Canvas.blockSize = Math.floor(Canvas.minSize * Canvas.scale);
}
Canvas.decreaseWorldScale = function () {
  Canvas.scale = parseFloat((Canvas.scale - 0.1).toFixed(1));
  if (Canvas.scale < 1) Canvas.scale = 1;
  
  Canvas.blockSize = Math.floor(Canvas.minSize * Canvas.scale);
}
Canvas.render = function (state) {
  Canvas.previousTime = Canvas.currentTime;
  Canvas.currentTime = Date.now();
  Canvas.delta = Canvas.currentTime - Canvas.previousTime;

  Canvas.updateViewport(state.character);
  Canvas.clearBuffer();
  Canvas.drawWorldToBuffer(state.world);
  Canvas.drawEntitiesToBuffer(state.entities);
  Canvas.clearCanvas();
  Canvas.drawBufferToCanvas();
  Canvas.drawDevUI();
}

Canvas.updateViewport = function (character) {
  // Canvas.viewport.left = character.components.Position.x;
  // Canvas.viewport.top = character.components.Position.y;
}
Canvas.worldToCanvas = function (worldPosition) {
  var x = ((worldPosition.x - worldPosition.y) * Canvas.blockSize / 2);
  var y = ((worldPosition.y + worldPosition.x) * Canvas.blockSize / 4);
  var z = worldPosition.z * Canvas.blockSize / 2;
  
  // if (position.x % 10 === 0 && position.y % 10 === 0) console.log(position, blockX, blockY, blockZ);
  return {
    x: x,
    y: y,
    z: z
  }
}
Canvas.canvasToWorld = function (canvasPosition) {
  // return world position in center of viewport
  var x = ((canvasPosition.x + canvasPosition.y) * 2 / Canvas.blockSize);
  var y = ((canvasPosition.y - canvasPosition.x) * 4 / Canvas.blockSize);
  
  // if (canvasPosition.x % 10 === 0 && canvasPosition.y % 10 === 0) console.log(x, y);
  return {
    x: Math.floor(x),
    y: Math.floor(y),
  }
}
Canvas.inViewport = function (x, y) {
  return  x + Canvas.blockSize >= Canvas.viewport.left &&
          x - Canvas.blockSize <= Canvas.viewport.left + Canvas.viewport.width &&
          y + Canvas.blockSize >= Canvas.viewport.top &&
          y - Canvas.blockSize <= Canvas.viewport.top + Canvas.viewport.height;
}
Canvas.isBlockVisible = function (bx, by, bz, maxX, maxY, maxZ, position) {
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


Canvas.drawEntitiesToBuffer = function (entities) {

}
Canvas.drawEntityToBuffer = function (x, y, z, width, height, color) {
  Canvas.buffer.fillStyle = color;
  Canvas.buffer.fillRect((x - y) * blockSize / 2, ((x + y) * (blockSize / 4)) - (z * blockSize / 2) - (blockSize / 4), -width, -height);
}
Canvas.drawWorldToBuffer = function (world) {
  Canvas.world = world;
  // have to do translations
  // canvas x, y will be relative to blockSize, scale, center of screen x,y
  for (var x = 0; x < world.x; x++) {
    for (var y = 0; y < world.y; y++) {
      for (var z = 0; z < world.z; z++) {
        var block = world.regions[x][y][z].block;
        if (block) {
          var canvasPosition = Canvas.worldToCanvas(world.regions[x][y][z].position);

          // adjust offset of viewport
          canvasPosition.x -= Canvas.offset.x;
          canvasPosition.y -= Canvas.offset.y;

          // if (x % 10 === 0 && y % 10 === 0) console.log(position, world.regions[x][y][z], Canvas.viewport, Canvas.viewport.center);
          if (Canvas.inViewport(canvasPosition.x, canvasPosition.y - canvasPosition.z) && Canvas.isBlockVisible(x, y, z, world.x, world.y, world.z, world.regions))
            Canvas.drawBlock(canvasPosition.x, canvasPosition.y - canvasPosition.z, z, block, .99);
        }
      }
    }
  }
  if (!Canvas.worldLoaded) Canvas.worldLoaded = true;
}
Canvas.drawBlock = function (x, y, z, block, a) {
  // draw left face
  Canvas.buffer.fillStyle = `rgba(${block.r - 75 + (z * 5)}, ${block.g - 75 + (z * 5)}, ${block.b - 75 + (z * 5)}, ${a})`;
  Canvas.buffer.beginPath();
  Canvas.buffer.moveTo(x, y);
  Canvas.buffer.lineTo(x, y + Canvas.blockSize / 2);
  Canvas.buffer.lineTo(x - Canvas.blockSize / 2, y + (Canvas.blockSize / 2) - (Canvas.blockSize / 4));
  Canvas.buffer.lineTo(x - Canvas.blockSize / 2, y - Canvas.blockSize / 4);
  Canvas.buffer.closePath();
  Canvas.buffer.fill();

  // draw right face
  Canvas.buffer.fillStyle = `rgba(${block.r - 45 + (z * 5)}, ${block.g - 45 + (z * 5)}, ${block.b - 45 + (z * 5)}, ${a})`;
  Canvas.buffer.beginPath();
  Canvas.buffer.moveTo(x, y);
  Canvas.buffer.lineTo(x, y + Canvas.blockSize / 2);
  Canvas.buffer.lineTo(x + Canvas.blockSize / 2, y + (Canvas.blockSize / 2) - (Canvas.blockSize / 4));
  Canvas.buffer.lineTo(x + Canvas.blockSize / 2, y - Canvas.blockSize / 4);
  Canvas.buffer.closePath();
  Canvas.buffer.fill();

  // draw top
  Canvas.buffer.fillStyle = `rgba(${block.r + (z * 5)}, ${block.g + (z * 5)}, ${block.b + (z * 5)}, ${a})`;
  Canvas.buffer.beginPath();
  Canvas.buffer.moveTo(x, y);
  Canvas.buffer.lineTo(x + Canvas.blockSize / 2, y - Canvas.blockSize / 4);
  Canvas.buffer.lineTo(x, y - Canvas.blockSize / 2);
  Canvas.buffer.lineTo(x - Canvas.blockSize / 2, y - Canvas.blockSize / 4);
  Canvas.buffer.closePath();
  Canvas.buffer.fill();
}
Canvas.drawBufferToCanvas = function () {
  // cut the drawn rectangle
  var image = Canvas.buffer.getImageData(Canvas.viewport.left, Canvas.viewport.top, Canvas.viewport.width, Canvas.viewport.height);
  // copy into visual canvas at different position
  Canvas.ctx.putImageData(image, 0, 0);
}
Canvas.drawDevUI = function () {
    Canvas.ctx.font = '14px Courier';
    Canvas.ctx.fillStyle = 'white';

    // canvas info
    Canvas.ctx.fillText(Math.floor((1000 / Canvas.delta)) + 'fps', 10, 20);
    Canvas.ctx.fillText('viewport', 10, 40);
    Canvas.ctx.fillText('left: ' + Canvas.viewport.left, 20, 60);
    Canvas.ctx.fillText('top: ' + Canvas.viewport.top, 20, 80);
    Canvas.ctx.fillText('width: ' + Canvas.viewport.width, 20, 100);
    Canvas.ctx.fillText('height: ' + Canvas.viewport.height, 20, 120);
    Canvas.ctx.fillText('centerX: ' + Canvas.viewport.center.x, 20, 140);
    Canvas.ctx.fillText('centerY: ' + Canvas.viewport.center.y, 20, 160);
    Canvas.ctx.fillText('offsetX: ' + Canvas.offset.x + ', offsetY: ' + Canvas.offset.y, 20, 180);
    Canvas.ctx.fillText('blockSize: ' + Canvas.blockSize, 20, 200);
    Canvas.ctx.fillText('scale: ' + Canvas.scale, 20, 220);
    // world info
    if (Canvas.world) {
      var currentCenter = {
        x: Canvas.offset.x + Canvas.viewport.center.x,
        y: Canvas.offset.y + Canvas.viewport.center.y
      };
      var worldLocation = Canvas.canvasToWorld(currentCenter);
      Canvas.ctx.fillText('overworld x: ' + worldLocation.x, 20, 240);
      Canvas.ctx.fillText('overworld y: ' + worldLocation.y, 20, 260);
      Canvas.ctx.fillText('world', 10, 300);
      Canvas.ctx.fillText('sample: ' + Canvas.world.sample, 20, 320);
      Canvas.ctx.fillText('x: ' + Canvas.world.x, 20, 340);
      Canvas.ctx.fillText('y: ' + Canvas.world.y, 20, 360);
      Canvas.ctx.fillText('z: ' + Canvas.world.z, 20, 380);
      Canvas.ctx.fillText('centerX: ' + Canvas.world.center.x, 20, 400);
      Canvas.ctx.fillText('centerY: ' + Canvas.world.center.y, 20, 420);
      Canvas.ctx.fillText('regions: ' + Canvas.world.regions.length, 20, 440);
    }
}

Canvas.clearBuffer = function () {
  Canvas.buffer.clearRect(0,0, Canvas.buff.width, Canvas.buff.height);
}
Canvas.clearCanvas = function () {
  Canvas.ctx.clearRect(0,0, Canvas.canvas.width, Canvas.canvas.height);
}

},{}],6:[function(require,module,exports){
var _chunk;
var _entities;

module.exports = {
  setWorld: function (chunk) {
    _chunk = chunk;
  },
  getWorld: function () {
    return _chunk;
  },
  setEntities: function (entities) {
    _entities = entities;
  },
  getEntities: function () {
    return _entities;
  },
  setCharacter: function (character) {
    _character = character;
  },
  getCharacter: function () {
    return _character;
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

},{}]},{},[3]);
