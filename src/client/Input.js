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
