module.exports = {
  create: function (seed) {
    let rand = new Random (seed);
    return rand;
  }
}

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
  this.a = 9301;
  this.b = 49297;
  this.m = 233280;
}
Random.prototype.next = function () {
  this.seed = (this.seed * this.a + this.b) % this.m;
  return this.seed / this.m;
}
Random.prototype.range = function (min, max) {
  return (this.random() * (max - min)) + min;
}
