var fs = require('fs');
var path = require('path');

var tiles = [];

module.exports = Tile = {
  types: tiles,
  get: function (name) {
    for (var i = 0; i < tiles.length; i++) {
      if (tiles[i].name === name) return tiles[i];
    }
  },
  create: function (name, options) {
    var tile = {
      name: name,
      color: options && options.color ? options.color : 'white'
    }

    tiles.push(tile);
    return tile;
  },
}

// require all tiles in resources
var tilesDir = path.join(process.cwd(), '/src/res/tiles');
var tileTypes = fs.readdirSync(tilesDir);
for (var i = 0; i < tileTypes.length; i++) {
  require(path.join(tilesDir, tileTypes[i]));
}
console.log(tiles);
