var map;

module.exports = World = function () {
  return this;
}

World.set = function (mapData) {
  map = mapData;
}
World.get = function () {
  return map;
}
