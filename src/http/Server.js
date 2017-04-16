// Node and NPM modules
var EventEmitter = require('events');

function start (app) {
  // setup the express server
  app.use(require('express').static('./public'));

}
module.exports = {
  start: start
}
