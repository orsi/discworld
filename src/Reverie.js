const World = require('./World');
let world = null;

var Reverie = {
  getWorld: function () {
    return world;
  },
  generateWorld: function (opts) {
    world = new World(opts);
    return world;
  }
}
module.exports = Reverie;
