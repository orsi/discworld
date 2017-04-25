// Reverie by Jonathon Orsi, February 25th, 2017

// extends base Javascript objects to include more functionality
require('./utils/JSExtensions');

var World = require('./world/World');

/*
 * Global environment variables
 */
global.Reverie = {
  _root: process.cwd()
}

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

// check database for world
// load database into memory

// or generate world
console.time('world generation');
var world = new World();
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

// create REPL
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt(`Enter command >> `);
rl.prompt();
rl.on('line', function(line) {
  console.log('');
  switch (line) {
    case 'exit':
      rl.close();
      break;
    case 'time':
      console.log(world.getTime());
      break;
    case 'info':
      console.log(world.get());
      break;
    case 'pause':
      break;
    case 'run':
      break;
    default:
      break;
  }
  console.log('');
  rl.prompt();
}).on('close', function(){
    console.log('\n\n');
    console.log('quitting Reverie...');
    process.exit(0);
});


// start logic loop
let simulationTime = 0.0;
const simulationInterval = 1000 / 60; // 60fps simulation

var currentTime = new Date();
var accumulator = 0.0;

function loop () {
  var newTime = new Date();
  var deltaTime = newTime - currentTime;
  currentTime = newTime;

  accumulator += deltaTime;

  while ( accumulator >= simulationInterval )
  {
      world.simulate(simulationInterval);
      simulationTime += simulationInterval;
      accumulator -= simulationInterval;
  }

  setTimeout(loop, 0);
}
loop();
