var _chunk;
var _entities;

module.exports = {
  setWorld: function (chunk) {
    _chunk = chunk;
  },
  getWorld: function () {
    return _chunk;
  },
  setEntities: function (entities) {
    _entities = entities;
  },
  getEntities: function () {
    return _entities;
  },
  setCharacter: function (character) {
    _character = character;
  },
  getCharacter: function () {
    return _character;
  },
  getNeighbours: function (mapX, mapY) {
    var neighbours = {
      north: map[mapX][mapY - 1],
      northEast: map[mapX + 1][mapY - 1],
      east: map[mapX + 1][mapY],
      southEast: map[mapX + 1][mapY + 1],
      south: map[mapX][mapY + 1],
      southWest: map[mapX - 1][mapY + 1],
      west: map[mapX - 1][mapY],
      northWest: map[mapX - 1][mapY - 1],
    };
    return neighbours;
  }
}
