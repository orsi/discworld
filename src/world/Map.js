module.exports = Field = function (width, height, scale) {
  this.width = width;
  this.height = height;
  this.scale = scale;
  this.map = [].length = Math.floor(width * scale) + Math.floor(height * scale);
  this.atLocation = function (x, y) {
    return map[Math.floor(x * scale) * Math.floor(x * y * scale)];
  }
}
