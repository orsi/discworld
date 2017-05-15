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
