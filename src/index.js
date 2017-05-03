// Reverie by Jonathon Orsi, February 25th, 2017
var Network = require('./network/Network');
var cli = require('./console/cli');
var Log = require('./console/Log');
var World = require('./world/world');
var EventChannel = require('./EventChannel');


/*
 * command-line arguments
 */

// set debug on if dev
if (process.argv.indexOf('--dev') > -1) {
  Log.set('debug');
}

// start http/socket servers if flag hasn't been set
var net;
if (process.argv.indexOf('--offline') === -1) {
  net = Network.init(3000);
}

// start a new world
console.time('world generation');
var world = World.create('Reverie');
console.timeEnd('world generation');

// start cli
cli.init();

// server loop
const serverInterval = 1000 / 100; // 100 ticks per second
const reverieInterval = 1000 / 60; // 60 ticks per second

var serverStartTime = new Date();
var currentTime = new Date().getTime();
var accumulator = 0.0;
var serverEventLoop = function () {
    var newTime = new Date().getTime();
    var deltaTime = newTime - currentTime;
    currentTime = newTime;

    // Reverie logic loop
    accumulator += deltaTime;
    while ( accumulator >= reverieInterval )
    {
      // proccess incoming network events

      // update world
      // world.simulate(reverieInterval);

      // process outgoing network events

      accumulator -= reverieInterval;
    }

    // process cli events
    // display output to server console
}
var serverEventLoopInterval = setInterval(serverEventLoop, serverInterval);
