var sockets = [];
var _io, _events;

module.exports =  {
  register: function (io, events) {
    _io = io;
    _events = events;

    // registers event handlers for incoming socket events
    _io.on('connection', (socket) => {
      sockets[socket.id] = socket;
      socket.join('new');

      attachNetworkEvents(socket);

      _events.emit('socket:connection', socket);
    });

    _events.on('world:init', (entity, chunk, entities) => {
      sockets[entity.socketId].emit('world:init', chunk, entities);
    });
  }
}

function attachNetworkEvents (socket) {
  socket.on('move', (data) => {
    _events.emit('socket:move', socket, data);
  });
  socket.on('ineract', (data) => {
    _events.emit('socket:ineract', socket, data);
  });
  socket.on('use', (data) => {
    _events.emit('socket:use', socket, data);
  });
  socket.on('skill', (data) => {
    _events.emit('socket:skill', socket, data);
  });
  socket.on('talk', (data) => {
    _events.emit('socket:talk', socket, data);
  });
  socket.on('look', (data) => {
    _events.emit('socket:look', socket, data);
  });
}
