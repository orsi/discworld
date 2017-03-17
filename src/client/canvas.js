var ctx;
var canvas;
var width;
var height;
var tileWidth;
var tileHeight;
module.exports = Canvas = function (c) {
  canvas = c;
  ctx = canvas.getContext('2d');
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  tileWidth = 100;
  tileHeight = 50;

  ctx.translate(width / 2, 50);


  Canvas.drawTile(0, 0, "red");
  Canvas.drawTile(1, 0, "green");
  Canvas.drawTile(2, 0, "blue");

  return this;
}
Canvas.draw = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,1)';
    ctx.beginPath();
    console.log('done');
  }
Canvas.update = function () {}
Canvas.drawTile = function (x, y, color) {
  ctx.save();

  ctx.translate(x * tileWidth / 2, (x + y) * tileHeight / 2);
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

Canvas.resize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Canvas.draw();
}

Canvas.drawWorld = function (world) {
  // if (Array.isArray(world._automata._grid)) {
  //   world._automata._grid.forEach(function (element) {
  //     var $col = document.createElement('div');
  //     $col.className = 'column';
  //     $col.style.width = '10px';
  //     $col.style.display = 'inline-block';
  //     element.forEach(function (cell, index) {
  //       var $tile = document.createElement('tile');
  //       $tile.setAttribute('value', cell);
  //       $tile.style.float = 'left';
  //       $tile.style.width = '10px';
  //       $tile.style.height = '10px';
  //       $tile.style.clear = index === 0 ? 'left' : 'none';
  //       $col.appendChild($tile);
  //     });
  //     $world.appendChild($col);
  //   });
  // }
  // // center world in middle of area
  // var reverieXCenter = $reverie.clientWidth / 2;
  // var reverieYCenter = $reverie.clientHeight / 2;
  // $world.style.position = 'absolute'
  // $world.style.top = reverieYCenter - (world._height * 10 / 2) + 'px';
  // $world.style.left = reverieXCenter - (world._width * 10 / 2) + 'px';
  // $reverie.appendChild($world);
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
