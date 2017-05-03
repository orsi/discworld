var EventChannel = require('../EventChannel');
var WorldObject = require('./WorldObject');

module.exports = {
  create: function (seed) {
    var world = new WorldObject(seed);
    world.registerEvents(EventChannel);
    return world;
  },
  WorldObject: WorldObject
};
