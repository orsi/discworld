// Reverie by Jonathon Orsi, February 25th, 2017
var Network = require('./server/Network');
var Logger = require('./server/Logger');
var Server = require('./server/Server');


/*
 * command-line arguments
 */

// set debug on if dev
var logger;
if (process.argv.indexOf('--dev') > -1) {
  logger = Logger.init(1);
}

// start http/socket servers if flag hasn't been set
var network;
if (process.argv.indexOf('--offline') === -1) {
  network = Network.init(3000);
}

// start server
var server;
if (true) {
  server = Server.init();
}
