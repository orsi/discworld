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

