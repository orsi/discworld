'use strict';
// Reverie by Jonathon Orsi, February 25th, 2017

// Node and NPM modules
const express = require('express')(),
      server = require('http').createServer(express),
      io = require('socket.io')(server),
      EventEmitter = require('events');

// load config file and setup environment
var config = require('./config.json');

// check command line arguments
process.argv.forEach(function (arg, index, array) {
  switch (arg) {
    case "--debug":
      log.setLevel('debug');
  }
});

// Register application events for ending process
process.on('SIGINT', function() {

  console.log('Nice SIGINT-handler');
  var listeners = process.listeners('SIGINT');
  for (var i = 0; i < listeners.length; i++) {
      console.log(listeners[i].toString());
  }

  process.exit();
});
process.on('exit', function () {
    console.log('exit');
    var listeners = process.listeners('exit');
    for (var i = 0; i < listeners.length; i++) {
        console.log(listeners[i].toString());
    }
});

// setup the express server
express.use(require('express').static('./client'))

// start the http server
server.listen(3000, function () {
  console.log('server listening on port 3000...');
});

const Events = require('./src/Events')(io);
const log = require('./utils/Log');

const World = require('./src/World');
const rev1 = require('./src/Reverie');
rev1.setTest('asdf');
const rev2 = require('./src/Reverie');
const rev3 = require('./src/Reverie');

console.log(rev1);
console.log(rev2);
console.log(rev3);

console.log(World.reverie);
