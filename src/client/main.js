// Reverie client
// Created by Jonathon Orsi

module.exports = Reverie = {};

Reverie.dom = {
  canvas: document.querySelector('#reverie'),
  terminal: document.querySelector('#terminal'),
  cursor: document.querySelector('cursor')
}
Reverie.input = require('./input')();
Reverie.sockets = require('./sockets')(io());
Reverie.terminal = require('./terminal')(Reverie.dom.terminal);
Reverie.canvas = require('./canvas')(Reverie.dom.canvas);
Reverie.world = require('./world')();

// start animation loop
function canvasLoop() {
  Canvas.render();
  requestAnimationFrame(canvasLoop);
}
canvasLoop();
