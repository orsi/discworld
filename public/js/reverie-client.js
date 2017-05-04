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
var scrollSpeed = 1/5;
Input.onMouseRight = function (e) {
  switch (Input.mouseLocation) {
    case 'topLeft':
      Canvas.move(scrollSpeed, 0);
      break;
    case 'topCenter':
      Canvas.move(scrollSpeed, scrollSpeed);
      break;
    case 'topRight':
      Canvas.move(0, scrollSpeed);
      break;
    case 'centerLeft':
      Canvas.move(scrollSpeed, -scrollSpeed);
      break;
    case 'centerCenter':
      break;
    case 'centerRight':
    Canvas.move(-scrollSpeed, scrollSpeed);
      break;
    case 'bottomLeft':
      Canvas.move(0, -scrollSpeed);
      break;
    case 'bottomCenter':
      Canvas.move(-scrollSpeed, -scrollSpeed);
      break;
    case 'bottomRight':
      Canvas.move(-scrollSpeed, 0);
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

module.exports = Reverie = {};

Reverie.dom = {
  canvas: document.querySelector('#reverie'),
  terminal: document.querySelector('#terminal'),
  cursor: document.querySelector('cursor')
}
Reverie.input = require('./input/input')();
Reverie.terminal = require('./input/terminal')(Reverie.dom.terminal);
Reverie.sockets = require('./network/sockets');
Reverie.sockets.init(io());

Reverie.canvas = require('./renderer/canvas');
Reverie.canvas.init(Reverie.dom.canvas);

Reverie.world = require('./world/world');

// start animation loop
function canvasLoop() {
  if (Reverie.world.get()) {
      Reverie.canvas.render({
        chunk: Reverie.world.get(),
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
function onWorldData(chunk, entities) {
  console.dir(chunk);
  console.dir(entities[0].components.Position);
  World.set(chunk);
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
var World = require('../world/world');

var ctx,
    canvas,
    width,
    height,
    originX,
    originY,
    scale = 1,
    tileWidth,
    tileHeight,
    blockSize;

var previousTime;

module.exports = {
  init: function (c) {
    canvas = c;
    ctx = canvas.getContext('2d');
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    tileWidth = 32;
    tileHeight = 16;
    blockSize = 64;
    originX = 0;
    originY = 0;
  },
  draw: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,1)';
    ctx.beginPath();
  },
  drawPixel: function (x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  },
  drawTile: function (x, y, color) {
    ctx.save();

    ctx.translate((x - y) * (tileWidth - 1) / 2, (x + y) * (tileHeight - 1) / 2);
      // (tileWidth - 1) brings tiles closer together and hides borders between tiles
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(tileWidth / 2, tileHeight / 2);
    ctx.lineTo(0, tileHeight);
    ctx.lineTo(-tileWidth / 2, tileHeight / 2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
  },
  drawSizedTile: function (x, y, tileWidth, tileHeight, elevation, color) {
    tileWidth = tileWidth * scale;
    tileHeight = tileWidth / 2;
    ctx.save();

    // translate x, y coordinates to proper tile sizes
    ctx.translate((x - y) * tileWidth / 2, (x + y) * tileHeight / 2);
    // translate elevation
    ctx.translate(0, elevation);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(tileWidth / 2, tileHeight / 2);
    ctx.lineTo(0, tileHeight);
    ctx.lineTo(-tileWidth / 2, tileHeight / 2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
  },
  drawSizedTileNeighbours: function (x, y, tileWidth, tileHeight, elevation, neighbours, color) {
    tileWidth = tileWidth * scale;
    tileHeight = tileWidth / 2;
    elevation = elevation * scale;

    var eastElevation = (tileHeight / 2) +  -(neighbours.east.elevation * scale);
    var southEastElevation = tileHeight +  -(neighbours.southEast.elevation * scale);
    var southElevation = (tileHeight / 2) + -(neighbours.south.elevation * scale);

    ctx.save();

    // translate x, y coordinates to proper tile sizes
    ctx.translate((x - y) * tileWidth / 2, (x + y) * tileHeight / 2);

    ctx.beginPath();
    ctx.moveTo(0, elevation);
    ctx.lineTo(tileWidth / 2, eastElevation);
    ctx.lineTo(0, southEastElevation);
    ctx.lineTo(-tileWidth / 2, southElevation);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
  },
  drawLocation: function (location) {
    var neighbours = World.getNeighbours(location.x, location.y);
    var tileWidth = 20 * scale;
    var tileHeight = tileWidth / 2;
    var elevation = location.elevation * scale;

    // var topVert = ;
    // var rightVert = ;
    // var bottomVert = ;
    // var leftVert = ;
    var eastElevation = (tileHeight / 2) +  -(neighbours.east.elevation * scale);
    var southEastElevation = tileHeight +  -(neighbours.southEast.elevation * scale);
    var southElevation = (tileHeight / 2) + -(neighbours.south.elevation * scale);

    ctx.save();

    // translate x, y coordinates to center of tile
    ctx.translate((location.x + 1) * tileWidth / 2, (location.y + 1) * tileHeight / 2);

    ctx.beginPath();
    ctx.moveTo(0, elevation);
    ctx.lineTo(tileWidth / 2, eastElevation);
    ctx.lineTo(0, southEastElevation);
    ctx.lineTo(-tileWidth / 2, southElevation);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
  },
  getTileCenter: function (x, y) {
    return {
      x: (location.x + 1) * tileWidth / 2,
      y: (location.y + 1) * tileHeight / 2,
    }
  },
  drawTileMap: function (map) {
    for (var i = 0; i < map[0].length; i++) {
      for (var j = 0; j < map.length; j++) {
        if (map[j][i].land)
          Canvas.drawTile(j + originX, i + originY, 'white');
      }
    }
  },
  move: function (x, y) {
    originX += x;
    originY += y;
  },
  resize: function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  },
  increaseWorldScale: function () {
    scale = parseFloat((scale + 0.1).toFixed(1));
    if (scale > 12) scale = 12;
  },
  decreaseWorldScale: function () {
    scale = parseFloat((scale - 0.1).toFixed(1));
    if (scale < 0.1) scale = 0.1;
  },

  render: function (state) {
    var delta = Date.now() - previousTime;
    previousTime = Date.now();
    ctx.save();
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.translate((canvas.width / 2), 0);
    drawWorld(state.chunk);
    drawEntities(state.entities);
    ctx.font = '14px Courier';
    ctx.fillStyle = 'white';
    ctx.fillText(Math.floor((1000 / delta)) + 'fps', 10, 20);
    ctx.restore();
  }
};

var BLOCKS = require('../../world/BlockTypes');
function drawWorld (chunk) {
  for (var i = 0; i < chunk[0].length; i++) {
    for (var j = 0; j < chunk.length; j++) {
      for (var k = 0; k < chunk[0][0].length; k++) {
        var color = 'rgba(0,0,0,.1)';
        var block = chunk[j][i][k];
        if (block) {
          drawBlock(j + originX, i + originY, k, block, .97);
        }
      }
    }
  }
}
function drawEntities(entities) {
  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];
    drawRect(entity.components.Position.x + originX, entity.components.Position.y + originY, entity.components.Position.z, 10, 25, 'blue');
  }
}
function drawRect (x, y, z, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect((x - y) * blockSize / 2, ((x + y) * (blockSize / 4)) - (z * blockSize / 2) - (blockSize / 4), -width, -height);
  ctx.restore();
}
function drawBlock(x, y, z, block, a) {
      ctx.save();

      // translate block to position
      ctx.translate((x - y) * blockSize / 2, ((x + y) * (blockSize / 4)) - (z * blockSize / 2));

      // draw left face
      ctx.fillStyle = `rgba(${block.r - 75 + (z * 5)}, ${block.g - 75 + (z * 5)}, ${block.b - 75 + (z * 5)}, ${a})`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, blockSize / 2);
      ctx.lineTo(-blockSize / 2, (blockSize / 2) - (blockSize / 4));
      ctx.lineTo(-blockSize / 2, -blockSize / 4);
      ctx.closePath();
      ctx.fill();

      // draw right face
      ctx.fillStyle = `rgba(${block.r - 45 + (z * 5)}, ${block.g - 45 + (z * 5)}, ${block.b - 45 + (z * 5)}, ${a})`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, blockSize / 2);
      ctx.lineTo(blockSize / 2, (blockSize / 2) - (blockSize / 4));
      ctx.lineTo(blockSize / 2, -blockSize / 4);
      ctx.closePath();
      ctx.fill();

      // draw top
      ctx.fillStyle = `rgba(${block.r + (z * 5)}, ${block.g + (z * 5)}, ${block.b + (z * 5)}, ${a})`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(blockSize / 2, -blockSize / 4);
      ctx.lineTo(0, -blockSize / 2);
      ctx.lineTo(-blockSize / 2, -blockSize / 4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
}

},{"../../world/BlockTypes":7,"../world/world":6}],6:[function(require,module,exports){
var _chunk;
var _entities;

module.exports = {
  set: function (chunk) {
    _chunk = chunk;
  },
  setEntities: function (entities) {
    _entities = entities;
  },
  get: function () {
    return _chunk;
  },
  getEntities: function () {
    return _entities;
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

},{}],7:[function(require,module,exports){
module.exports = {
  GRASS: {
    r:77,
    g:158,
    b:58
  },
  SOIL: {
    r:109,
    g:88,
    b:74
  },
  ROCK: {
    r:123,
    g:113,
    b:103
  },
  METAL: {
    r:192,
    g:192,
    b:192
  },
  CORE: {
    r:10,
    g:10,
    b:10
  }
}

},{}]},{},[3]);
