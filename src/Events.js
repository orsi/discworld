const Actor = require('./Actor');
const Reverie = require('./Reverie');

function Events (io) {
  if (!(this instanceof Events)) return new Events(io);
  // registers all events for the network
  io.on('connection', Events.prototype.onConnection);
}

Events.prototype.onConnection = function (socket) {
  console.log('new connection', socket.id);

  // send actor information back to client socket
  socket.emit('world data', Reverie.getWorld());

  // register socket events with client socket
  socket.on('world create', Events.prototype.onCommandWorldCreate);
  socket.on('world step', Events.prototype.onCommandWorldStep);
  // socket.on('actor move', Events.prototype.onActorMove);
  // socket.on('actor message', Events.prototype.onActorMessage);
}
Events.prototype.onCommandWorldCreate = function (opts, res) {
  let newWorld = Reverie.generateWorld(opts);
  res(true, newWorld);
}
Events.prototype.onCommandWorldStep = function (opts, res) {
  let world = Reverie.getWorld();
  world.getAutomata().next();
  res(true, world);
}
Events.prototype.onActorMove = function (movement, res) {
    // socket.actor.x = movement.x;
    // socket.actor.y = movement.y;

    // confirm movement
    res(true, { x: movement.x, y: movement.y });
  };
Events.prototype.onActorMessage = function (message, res) {
    console.log(message);

    res(true, { text: message });
  };

  module.exports = Events;
