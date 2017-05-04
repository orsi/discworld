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
