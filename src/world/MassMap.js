module.exports = MassField;
function MassField() {

}
MassField.prototype.generateLand = function (width, height) {
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
MassField.prototype.generateElevation = function (width, height, land) {
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
}
