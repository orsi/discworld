'use strict';
// Reverie by Jonathon Orsi, February 25th, 2017

// extends base Javascript objects to include more functionality
require('./src/utils/JSExtensions');

// load config file
var config = require('./config.json');

// command-line options
let startServer = false;
process.argv.forEach(function (arg, index, array) {
  switch (arg) {
    case "--debug":
      log.setLevel('debug');
      break;
    case '--live':
      startServer = true;
      break;
  }
});

// on process exit
process.on('exit', function () {
    console.log('quitting Reverie...');
});

// generate world
const Reverie = require('./src/Reverie');
console.time('generation');
Reverie.generateWorld({});
console.timeEnd('generation');

// start server
console.time('server');
if (startServer) {
  const Server = require('./src/Server').start();
}
console.timeEnd('server');
