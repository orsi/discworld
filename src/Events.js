const Actor = require('./Actor');

module.exports = Events;
function Events (io) {
  if (!(this instanceof Events)) return new Events(io);
  // registers all events for the network
  io.on('connection', Events.prototype.onConnection);
}

Events.prototype.onConnection = function (socket) {
    console.log('new connection', socket.id);
    socket.actor = new Actor();

    // send actor information back to client socket
    socket.emit('actor connected', socket.actor);

    // register socket events with client socket
    socket.on('actor move', Events.prototype.onActorMove);
    socket.on('actor message', Events.prototype.onActorMessage);
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
