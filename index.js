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
  console.log('sigint');
  process.exit();
});
process.on('exit', function () {
    console.log('exit');
});

// setup the express server
express.use(require('express').static('./client'))

// start the http server
server.listen(3000, function () {
  console.log('server listening on port 3000...');
});

const Events = require('./src/Events')(io);
//const log = require('./utils/Log');

const Reverie = require('./src/Reverie');
console.time('generation');
Reverie.generateWorld({
  x: 150,
  y: 150,
  steps: 10,
  alivePercent: 0.4,
  birth: [6,7,8],
  survival: [3,4,5,6,7,8],
});
console.timeEnd('generation');
// console.dir(Reverie.getWorlds()[0].cellMap);
