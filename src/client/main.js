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
