// Node and NPM modules
const express = require('express')(),
      server = require('http').createServer(express),
      io = require('socket.io')(server),
      EventEmitter = require('events');

function start () {
  // setup the express server
  express.use(require('express').static('./public'));

  // start the http server
  server.listen(3000, function () {
    console.log('server listening on port 3000...');
  });

  // pass socket.io to the event module
  Events = require('./Events')(io);
}
module.exports = {
  start: start
}
