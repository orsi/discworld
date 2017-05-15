// imports
var Canvas = require('../renderer/canvas');
var World = require('../world/world');

module.exports = {
  init: function (socket) {
    socket.on('world:init', onWorldData);
    socket.on('actor connected', createActor);
    socket.on('newMessage', newMessage);
  }
}
function onWorldData(character, world, entities) {
  console.dir(world);
  console.dir(character);
  World.setCharacter(character);
  World.setWorld(world);
  World.setEntities(entities);
}
function newMessage(message) {
}
// functions
function createActor(actor) {
  // var $actor = document.createElement('actor');
  // $actor.style.color = actor.color;
  // $actor.style.position = 'absolute';
  // $actor.style.top = actor.y;
  // $actor.style.left = actor.x;
  // $actor.appendChild(document.createTextNode(actor.symbol));
  // world.appendChild($actor);
}
function sendWorldCreateCommand() {
  sockets.emit('world create', args, function (response, world) {
    if (response) Canvas.renderWorld(world);
  });
}
function onMessage(response, message) {
  console.log(response, message);
  // if (response) {
  //   var $actor = document.querySelector('actor');
  //   var $speech = document.querySelector('actor > p');
  //   console.dir($speech);
  //   if (!$speech) {
  //     var $speech = document.createElement('p');
  //     $speech.style.position = 'absolute';
  //     $speech.style.top = '-100%';
  //     $speech.style.margin = 0;
  //     $speech.appendChild(document.createTextNode(''));
  //     $actor.appendChild($speech);
  //   }
  //   $speech.childNodes[0].nodeValue = message.text;
  // }
}
function sendWorldStepCommand() {
  sockets.emit('world step', null, function (response, world) {
    if (response) Canvas.renderWorld(world);
  });
}
