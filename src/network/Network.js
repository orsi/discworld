var EventChannel = require('../EventChannel');
var SocketEvents = require('./SocketEvents');
var express = require('express');
var http = require('http');
var io = require('socket.io');
var app, httpServer, socketServer;

module.exports = {
  init: function (port) {
    app = express();
    httpServer = http.Server(app);
    app.use(express.static('./public'));
    socketServer = SocketEvents.register(io(httpServer), EventChannel);
    httpServer.listen(port || 3000);

    EventChannel.emit('network:start');
  }
}
