// dependencies
var Random = require('../utils/Random');
var Automata = require('../utils/Automata');

module.exports = World = {
  width: 0,
  height: 0,
  seed: 0,
  automata: 0,
  players: [],
  entities: [],
  get: function () {
    console.log('getting map', aWorld.utomata);
    return World.automata;
  },
  generate: function (opts) {
      // check for options
      var defaults = {
        width: 50,
        height: 50,
        seed: 'Reverie'
      };
      defaults.override(opts);

      World.width = defaults.width;
      World.height = defaults.height;
      World.seed = defaults.seed;

      // Set seed in random number generate
      Random.seed(World.seed);

      World.automata = new Automata({}).getMap();
      // _elevationMap = createElevationMap();
  },
  getLocation: function(x, y) {
    return World.automata[x][y];
  },
  getMapRange: function(topX, topY, bottomX, bottomY) {
    if (topX >= 0 && topY >= 0 && bottomX < World.width && bottomY < World.height) {
      var range = [];
      for (var i = 0; i + topX <= bottomX; i++) {
        range.push([]);
        for (var j = 0; j + topY <= bottomY; j++) {
          range[i][j] = World.getLocation(i, j);
        }
      }
      return range;
    } else {
      return 'out of range';
    }
  },
  getAutomata: function() {
    return World.automata;
  },
  getWidth: function() {
    return World.width;
  },
  getHeight: function() {
    return World.height;
  },
  createElevationMap: function(cellMap) {}
}
