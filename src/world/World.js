// dependencies
var FieldFactory = require('./Fields/FieldFactory')

var Random = require('../utils/Random');
var Automaton = require('../utils/Automaton');
var Perlin = require('../utils/Perlin');

module.exports = class World {
  constructor() {
    this.startTime = new Date(),
    this.lifeTime = 0.0,
    this.seed = 'Reverie',
    this.width = 1000,
    this.height = 1000,
    this.depth = 50,
    this.fields = {};

    // Set seed in random number generate
    Random.seed(this.seed);

    // pre-generate world fields
    this.fields.energy = FieldFactory.create('energy', { height: this.height, width: this.width, depth: this.depth });
    this.fields.mass = FieldFactory.create('mass', { height: this.height, width: this.width, depth: this.depth });
    this.fields.water = FieldFactory.create('water', { height: this.height, width: this.width, depth: this.depth });
  }

  simulate (time) {
    this.lifeTime += time;
  }
  get() {
    return this;
  }
  getTime() {
    return this.lifeTime;
  }
  getWidth () {
    return this.width;
  }
  getHeight () {
    return this.height;
  }
  getDepth () {
    return this.depth;
  }
}

// World.prototype.generateTiles = function (width, height, depth) {
//   var tiles = [];
//   for (var x = 0; x < width; x++) {
//     tiles.push([]);
//     for (var y = 0; y < height; y++) {
//       if(depth[x][y] < 0) {
//           tiles[x][y] = Tile.get("water");
//       } else if (depth[x][y] < 5) {
//           tiles[x][y] = Tile.get("grass");
//       }  else {
//           tiles[x][y] = Tile.get("mountain");
//       }
//     }
//   }
//   return tiles;
// }
// World.prototype.getLocation = function(x, y) {
//   // Gather all information for particular location in world
//   var location = {
//     x: x,
//     y: y,
//     mass: World.fields.mass[x][y],
//     depth: World.fields.depth[x][y]
//   };
//   return location;
// }
// World.prototype.get = function (scale) {
//   var scaledWidth = Math.floor(World.width * scale);
//   var scaledHeight = Math.floor(World.height * scale);
//   var world = [];
//   for (var x = 0; x < scaledWidth; x++) {
//     world.push([]);
//     for (var y = 0; y < scaledHeight; y++) {
//       world[x][y] = World.getLocation(x * Math.ceil(1 / scale), y * Math.ceil(1 / scale));
//     }
//   }
//   return world;
// }
// World.prototype.getMapRange = function(startX, startY, endX, endY) {
//   var range = [];
//   for (var x = 0; x + startX <= endX; x++) {
//     range.push([]);
//     for (var y = 0; y + startY <= endY; y++) {
//       range[x][y] = World.getLocation(x + startX, y + startY);
//     }
//   }
//   return range;
// }
