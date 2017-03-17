// dependencies
const Random = require('./utils/Random');
const Automata = require('./utils/Automata');

// private static
class World {
  getLocation (x, y) {

  }
  getAutomata () {
    return this._automata;
  }
  getWidth () {
    return this._width;
  }
  getHeight () {
    return this._height;
  }
  createElevationMap (cellMap) {

  }

  constructor(opts) {
    let self = this;
    // check for options
    this.options = {
      width: 50,
      height: 50,
      seed: 'Reverie'
    };
    this.options.override(opts);

    this._width = self.options.width;
    this._height = self.options.height;
    this._seed = self.options.seed;

    // Set seed in random number generate
    Random.seed(this._seed);

    this._automata = new Automata({
      width: 50,
      height: 75,
      steps: 4
    });
    // this._elevationMap = this.createElevationMap();
  }
}
module.exports = World;
