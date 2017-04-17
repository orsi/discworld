// dependencies
var Random = require('../utils/Random');
var Map = require('./Map');
var Automaton = require('../utils/Automaton');
var Perlin = require('../utils/Perlin');

module.exports = World = {
  seed: 'Reverie',
  width: 1000,
  height: 1000,
  elevation: 50,
  maps: {},
  entities: [],
  generate: function () {
      // Set seed in random number generate
      Random.seed(World.seed);

      // pre-generate world maps
      World.maps.land = World.generateLand(World.width, World.height);
      World.maps.elevation = World.generateElevation(World.width, World.height, World.maps.land);
  },
  generateLand: function (width, height) {
    var scale = 1/20;
    var scaledWidth = Math.floor(width * scale);
    var scaledHeight = Math.floor(height * scale);
    var cellMap = new Automaton(scaledWidth, scaledHeight);

    var land = [];
    for (var x = 0; x < width; x++) {
      land.push([]);
      var scaleX = Math.floor(x * scale);
      for (var y = 0; y < height; y++) {
        var scaleY =  Math.floor(y * scale);
        land[x][y] = cellMap.atLocation(scaleX, scaleY);
      }
    }
    return land;
  },
  generateElevation: function (width, height, land) {
    var elevation = [];
    for (var x = 0; x < width; x++) {
      elevation.push([]);
      for (var y = 0; y < height; y++) {
        if (land[x][y]) {
          elevation[x][y] = World.elevation * Perlin.noise(x / (width * 1/20), y / (height * 1/20));
        } else {
          elevation[x][y] = 0;
        }
      }
    }
    return elevation;
  },
  getLocation: function(x, y) {
    // Gather all information for particular location in world
    var location = {
      land: World.maps.land[x][y],
      elevation: World.maps.elevation[x][y]
    };
    return location;
  },
  get: function (scale) {
    var scaledWidth = Math.floor(World.width * scale);
    var scaledHeight = Math.floor(World.height * scale);
    var world = [];
    for (var x = 0; x < scaledWidth; x++) {
      world.push([]);
      for (var y = 0; y < scaledHeight; y++) {
        world[x][y] = World.getLocation(x * Math.ceil(1 / scale), y * Math.ceil(1 / scale));
      }
    }
    return world;
  },
  getMapRange: function(startX, startY, endX, endY) {
    var range = [];
    for (var x = 0; x + startX <= endX; x++) {
      range.push([]);
      for (var y = 0; y + startY <= endY; y++) {
        range[x][y] = World.getLocation(x + startX, y + startY);
      }
    }
    return range;
  },
  getWidth: function() {
    return World.width;
  },
  getHeight: function() {
    return World.height;
  },
  createElevationMap: function(cellMap) {}
}
