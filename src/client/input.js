var Canvas = require('./canvas'),
    Terminal = require('./terminal');

module.exports = Input = function () {
  window.addEventListener('resize', Canvas.resize);

  // IE9, Chrome, Safari, Opera
  window.addEventListener("mousewheel", Input.onMouseWheel, false);

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
  if (e.wheelDelta > 0) {
    canvas.increaseWorldScale();
  } else {
    canvas.decreaseWorldScale();
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
