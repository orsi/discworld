module.exports = {
  normalize: function (number, min, max) {
    return (number * (max - min)) + min;
  }
}