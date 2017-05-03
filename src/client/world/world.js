var _chunk;
var _entities;

module.exports = {
  set: function (chunk) {
    _chunk = chunk;
  },
  setEntities: function (entities) {
    _entities = entities;
  },
  get: function () {
    return _chunk;
  },
  getEntities: function () {
    return _entities;
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
