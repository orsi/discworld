var SystemEvents = require('./SystemEvents');
var events;
var express = require('express');
var http = require('http');
var io = require('socket.io');

var clients = [];

module.exports = {
  init: function (port) {
    var app = express();
    var httpServer = http.Server(app);
    app.use(express.static('./public'));
    io = io(httpServer);
    
    // listen for new client http requests
    httpServer.listen(port || 3000);

    // register system to SystemEvents
    events = SystemEvents.register('network');

    // listen for new client socket connections
    io.on('connection', (socket) => {
      var client = new Client(socket, events);
      clients[client.id] = client;
      client.onConnection();
    });
    
    // events for all systems to use
    events.on('network/broadcast', (event, data) => {
      io.emit(event, data);
    })
    events.on('network/multicast', (clientIds, event, data) => {
      clientIds.forEach(function (id) {
        clients[id].send(event, data);
      });
    })
    events.on('network/send', (clientId, event, data) => {
      clients[id].send(event, data);
    });

    // emit network initialized
    events.emit('initialized');
  }
}

function Client (socket, events) {
  this.id = socket.id;
  this.socket = socket;

  // register received events from client
  this.socket.on('disconnect', () => this.onDisconnect());
  this.socket.on('message', (message) => this.onMessage(message));
  this.socket.on('move', () => this.onMove());
  this.socket.on('inspect', () => this.onInspect());
  this.socket.on('interact', () => this.onInteract());
}

Client.prototype.send = function (event, data) {
  this.socket.emit(event, data);
}
Client.prototype.onConnection = function () {
  // client has connected to the server
  events.emit('client/connection', this);
}
Client.prototype.onDisconnect = function () {
  // client has disconnected from the server
  events.emit('client/disconnect', this);
}
Client.prototype.onMessage = function (message) {
  // message is a message sent when a client
  // submits input from their terminal
  console.log(this);
  events.emit('client/message', this, message);
}
Client.prototype.onMove = function (message) {
  // move is message sent when a client
  // holds down the right mouse button
  events.emit('client/move', this, message);
}
Client.prototype.onInspect = function (message) {
  // inspect is a message sent when a client
  // single clicks left mouse button
  events.emit('client/inspect', this, message);
}
Client.prototype.onInteract = function (message) {
  // interact is a message sent when a client
  // double clicks left mouse button
  events.emit('client/interact', this, message);
}