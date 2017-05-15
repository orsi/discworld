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
