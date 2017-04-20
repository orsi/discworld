var Entity = require('../entities/Entity');
var World = require('../world/World');

function Sockets (io) {
  // registers all events for the network
  io.on('connection', Sockets.prototype.onConnection);
}

Sockets.prototype.onConnection = function (socket) {
  console.log('new connection', socket.id);

  // send actor information back to client socket
  socket.emit('world data', World.get(0.1));

  // register socket events with client socket
  socket.on('world create', Sockets.prototype.onCommandWorldCreate);
  socket.on('world step', Sockets.prototype.onCommandWorldStep);
  // socket.on('actor move', Sockets.prototype.onActorMove);
  // socket.on('actor message', Sockets.prototype.onActorMessage);
}
Sockets.prototype.onCommandWorldCreate = function (opts, res) {
  var newWorld = World.generate(opts);
  res(true, newWorld);
}
Sockets.prototype.onCommandWorldStep = function (opts, res) {
  var world = World.get();
  world.getAutomata().next();
  res(true, world);
}
Sockets.prototype.onActorMove = function (movement, res) {
    // socket.actor.x = movement.x;
    // socket.actor.y = movement.y;

    // confirm movement
    res(true, { x: movement.x, y: movement.y });
  };
Sockets.prototype.onActorMessage = function (message, res) {
    console.log(message);

    res(true, { text: message });
  };

  module.exports = Sockets;
