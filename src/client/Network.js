var server;
module.exports = {
  init: function (socket) {
    var events = EventManager.register('network');
    server = new Server(socket, events);
  },
  send: function (type, data) {
    switch (type) {
      case 'message':
        server.sendMessage(data);
        break;
    }
  }
}

// imports
var EventManager = require('./EventManager');
// var Canvas = require('./Renderer');
// var World = require('./World');

function Server (socket, events) {
    // register receiving events
    this.socket = socket;
    this.events = events;

    // recieved events from server
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.socket.on('entity', (e) => {
      this.events.emit('entity', e);
    });
    this.socket.on('world', (w) => {
      this.events.emit('world', w);
    });
    // this.socket.on('world:created', (world) => {
    //   this.events.emit('world', world);
    // });
    // this.socket.on('world:generated', (regions) => {
    //   console.log(regions);
    //   this.events.emit('regions', regions);
    // });

    // events from systems to server
    this.events.on('input:message', (message) => {
      this.socket.emit('message', message, () => {

      });
    });
    // socket.on('network:world:initialized', (character, world, entities) => {
    //   console.dir(world);
    //   console.dir(character);
    //   World.setCharacter(character);
    //   World.setWorld(world);
    //   World.setEntities(entities);
    // });
}

Server.prototype.newMessage = function (message) {}
Server.prototype.sendMessage = function (message) {
}