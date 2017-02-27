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

// setup the express server
express.use(require('express').static('./client'))

// start the http server
server.listen(3000, function () {
  console.log('server listening on port 3000...');
});

const Events = require('./src/Events')(io);
const log = require('./utils/Log');
