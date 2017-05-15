module.exports = Random = {
  _seed: new Date().getTime(),
  _a: 9301,
  _b: 49297,
  _m: 233280,
  seed: function (seed) {
    if (typeof seed === 'string') {
      var values = [];
      for (var i = 0; i < seed.length; i++) {
        values.push(seed.charCodeAt(i));
      }
      seed = values.join('') + 0;
    }
    this._seed = seed;
  },
  random: function () {
    this._seed = (this._seed * this._a + this._b) % this._m;
    return this._seed / this._m;
  },
  range: function (min, max) {
    return (this.random() * (max - min)) + min;
  }
}
