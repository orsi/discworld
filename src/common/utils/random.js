module.exports = Random;
function Random (seed) {
  if (!seed) seed = new Date().getTime();
  if (typeof seed === 'string') {
    var values = [];
    for (var i = 0; i < seed.length; i++) {
      values.push(seed.charCodeAt(i));
    }
    seed = values.join('') + 0;
  }
  this._seed = seed;
  this._a = 9301;
  this._b = 49297;
  this._m = 233280;
}
Random.prototype.next = function () {
  this._seed = (this._seed * this._a + this._b) % this._m;
  return this._seed / this._m;
}
Random.prototype.range = function (min, max) {
  return (this.next() * (max - min)) + min;
}
