const ServerEvents = require('./ServerEvents');
const express = require('express');
const http = require('http');
const io = require('socket.io');

module.exports = Network;
function Network (config) {
  // configure express and socket.io
  this.express = express();
  this.httpServer = http.Server(this.express);
  this.express.use(express.static('./public'));
  this.socketServer = io(this.httpServer);
  
  // listen for new client http requests
  this.httpServer.listen(config.port || 3000);

  // register system to SystemEvents
  this.events = ServerEvents.register('network');
  
  this.clients = [];
  // listen for new client socket connections
  this.socketServer.on('connection', (socket) => {
    let client = new Client(socket, this.events);
    this.clients[client.id] = client;
    client.onConnection();
  });
  
  // events for all systems to use
  this.events.on('network/broadcast', (event, data) => {
    console.log('emitting');
    this.socketServer.emit(event, data);
  })
  this.events.on('network/multicast', (clientIds, event, data) => {
    clientIds.forEach(function (id) {
      this.clients[id].send(event, data);
    });
  })
  this.events.on('network/send', (clientId, event, data) => {
    this.clients[id].send(event, data);
  });

  // emit network initialized
  this.events.emit('initialized');
}

/*
 *  Client Object
 * 
 *  */
function Client (socket) {
  this.id = socket.id;
  this.socket = socket;
  this.events = ServerEvents.register('client/' + this.id);

  // register received events from client
  this.socket.on('disconnect', () => this.onDisconnect());

  this.socket.on('player/message', (message) => this.onMessage(message));
  this.socket.on('player/move', (movement) => this.onMove(movement));
  this.socket.on('player/inspect', () => this.onInspect());
  this.socket.on('player/interact', () => this.onInteract());
  this.socket.on('player/levitate', (levitate) => this.onPlayerLevitate(levitate));
  
  this.socket.on('world/world', (wm) => this.onReceiveWorldMap(wm));
}
Client.prototype.send = function (event, data) {
  this.socket.emit(event, data);
}
Client.prototype.onConnection = function () {
  // client has connected to the server
  this.events.emit('client/connection', this);
}
Client.prototype.onDisconnect = function () {
  // client has disconnected from the server
  this.events.emit('client/disconnect', this);
}
Client.prototype.onMessage = function (message) {
  // message is a message sent when a client
  // submits input from their terminal
  this.events.emit('client/message', this, message);
}
Client.prototype.onMove = function (movement) {
  // move is message sent when a client
  // holds down the right mouse button
  this.events.emit('client/move', this, movement);
}
Client.prototype.onInspect = function (message) {
  // inspect is a message sent when a client
  // single clicks left mouse button
  this.events.emit('client/inspect', this, message);
}
Client.prototype.onInteract = function (message) {
  // interact is a message sent when a client
  // double clicks left mouse button
  this.events.emit('client/interact', this, message);
}
Client.prototype.onPlayerLevitate = function (levitate) {
  // interact is a message sent when a client
  // double clicks left mouse button
  this.events.emit('player/levitate', this, levitate);
}
Client.prototype.onReceiveWorldMap = function (wm) {
  // world map sent by server
  this.events.emit('world/world', this, wm);
}