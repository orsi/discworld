var World = require('./world');

var ctx,
    canvas,
    width,
    height,
    originX,
    originY,
    tileWidth,
    tileHeight;

module.exports = Canvas = function (c) {
  canvas = c;
  ctx = canvas.getContext('2d');
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  tileWidth = 32;
  tileHeight = 16;
  originX = 0;
  originY = 0;
  return this;
}
Canvas.draw = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,1)';
    ctx.beginPath();
  }
Canvas.update = function () {}

Canvas.drawPixel = function (x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}
Canvas.drawRect = function (x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * width, y * height, width, height);
}

Canvas.drawTile = function (x, y, color) {
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
}
Canvas.drawSizedTile = function (x, y, tileWidth, tileHeight, elevation, color) {
  tileHeight = tileHeight * scale;
  tileWidth = tileWidth * scale;
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
}
Canvas.drawSizedTileNeighbours = function (x, y, tileWidth, tileHeight, elevation, neighbours, color) {
  tileHeight = tileHeight * scale;
  tileWidth = tileWidth * scale;

  var eastElevation = (tileHeight / 2) +  -(neighbours.east.elevation);
  var southEastElevation = tileHeight +  -(neighbours.southEast.elevation)
  var southElevation = (tileHeight / 2) + -(neighbours.south.elevation)

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
}
Canvas.drawTileMap = function (map) {
  for (var i = 0; i < map[0].length; i++) {
    for (var j = 0; j < map.length; j++) {
      if (map[j][i].land)
        Canvas.drawTile(j + originX, i + originY, 'white');
    }
  }
}
Canvas.drawWorld = function (world) {
  var worldWidth = world.length;
  var worldHeight = world[0].length;

  for (var i = 0; i < world[0].length; i++) {
    for (var j = 0; j < world.length; j++) {
      if (world[j][i].land)
        Canvas.drawSizedTileNeighbours(j + originX, i + originY, 20, 10, -(world[j][i].elevation), World.getNeighbours(j, i), 'green');
    }
  }
}

Canvas.move = function (x, y) {
  originX += x;
  originY += y;
}
Canvas.resize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

var scale = 1;
Canvas.increaseWorldScale = function () {
  scale = parseFloat((scale + 0.1).toFixed(1));
  if (scale > 12) scale = 12;
  console.log(scale);
}
Canvas.decreaseWorldScale = function () {
  scale = parseFloat((scale - 0.1).toFixed(1));
  if (scale < 0) scale = 0;
  console.log(scale);
}

var previousTime;
Canvas.render = function () {
  var delta = Date.now() - previousTime;
  previousTime = Date.now();
  if (World.get()) {
    ctx.save();
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.translate((canvas.width / 2), 0);
    Canvas.drawWorld(World.get());
    ctx.font = '14px Courier';
    ctx.fillStyle = 'white';
    ctx.fillText(Math.floor((1000 / delta)) + 'fps', 10, 20);
    ctx.restore();
  }
}
