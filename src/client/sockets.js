// imports
var Canvas = require('./canvas');
var World = require('./world');

module.exports = Sockets = function (socket) {
  socket.on('world data', Sockets.onWorldData);
  socket.on('actor connected', Sockets.createActor);
  socket.on('newMessage', Sockets.newMessage);

  return this;
}
Sockets.onWorldData = function (map) {
  console.log(map);
  World.set(map);
}
Sockets.newMessage = function (message) {
}
// functions
Sockets.createActor = function (actor) {
  // var $actor = document.createElement('actor');
  // $actor.style.color = actor.color;
  // $actor.style.position = 'absolute';
  // $actor.style.top = actor.y;
  // $actor.style.left = actor.x;
  // $actor.appendChild(document.createTextNode(actor.symbol));
  // world.appendChild($actor);
}
Sockets.sendWorldCreateCommand = function () {
  sockets.emit('world create', args, function (response, world) {
    if (response) Canvas.renderWorld(world);
  });
}
Sockets.onMessage = function (response, message) {
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

Sockets.sendWorldStepCommand = function () {
  sockets.emit('world step', null, function (response, world) {
    if (response) Canvas.renderWorld(world);
  });
}
