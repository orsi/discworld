// Reverie by Jonathon Orsi, February 25th, 2017

/*
 * Global environment variables
 */
global.Reverie = {
  _root: process.cwd()
}

// extends base Javascript objects to include more functionality
require('./utils/JSExtensions');

// command-line options
var httpServer = false;
process.argv.forEach(function (arg, index, array) {
  switch (arg) {
    case "--debug":
      log.setLevel('debug');
      break;
    case '--live':
      httpServer = true;
      break;
  }
});

// on process exit
process.on('exit', function () {
    console.log('quitting Reverie...');
});

// check database for world
// load database into memory

// or generate world
console.time('world generation');
var world = require('./world/World');
world.generate({});
console.timeEnd('world generation');

// start http server
if (httpServer) {
  // create express app, pass to httpServer module
  var app = require('express')();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);

  // pass to http and socket modules
  var httpModule = require('./http/Server').start(app);
  var sockets = require('./sockets/Sockets')(io);

  // start listening
  http.listen(3000, function(){
    console.log('listening on localhost:3000');
  });
}

// start logic loop
