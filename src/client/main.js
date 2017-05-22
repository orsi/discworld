// Reverie client
// Created by Jonathon Orsi
const Renderer = require('./Renderer');
const World = require('./World');
const Entity = require('./Entity');
const Input = require('./Input');
const Network = require('./Network');

// init socket.io
Network.init(io());

// init Input
Input.init();

// init Renderer
Renderer.init(document.querySelector('#reverie'));

// init World
World.init();

// init Entity
Entity.init();

// start update loop
function update() {
  Renderer.render({
    entity: Entity.get('entity'),
    world: World.get('world'),
    debug: {
      world: World.get('world'),
      entity: Entity.get('entity')
    },
  });
  requestAnimationFrame(update);
}
update();
