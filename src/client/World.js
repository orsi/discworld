var EventManager = require('./EventManager');
var events;

var world;
var lastEvent = Date.now();
module.exports = {
  init: function () {
    events = EventManager.register('world');

    // register events
    events.on('network:world', (w) => {
      world = new World(w);
    });
  },
  exists: function () {
    return (world !== null);
  },
  get: function (type) {
    var data = null;
    switch (type) {
      case 'world':
        data = world;
        break;
      case 'entity':
        data = entity;
        break;
    }
    return data;
  },
  trigger: function (event) {
    var currentTime = Date.now();
    if (currentTime - lastEvent > 100) {
      switch (event) {
        case 'zoomIn':
          var originalScale = world.scale;
          world.scale = parseFloat((world.scale + 0.1).toFixed(1));
          if (world.scale > 15) world.scale = 15;
          Network.send('world:scale', world.scale, (err) => {
            if (err) world.scale = originalScale;
          });
          break;
        case 'zoomOut':
          var originalScale = world.scale;
          world.scale = parseFloat((world.scale - 0.1).toFixed(1));
          if (world.scale < 1) world.scale = 1;
          Network.send('world:scale', world.scale, (err) => {
            if (err) world.scale = originalScale;
          });
          break;
      }

      lastEvent = currentTime;
    }
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

// imports
var Network = require('./Network');

var _chunk;
var _entities;
var world = null;



function World (world) {
  this.createdAt = world.createdAt;
  this.cycle = world.cycle;
  this.scale = world.scale;
  this.seed = world.seed;
  this.x = world.x;
  this.y = world.y;
  this.z = world.z;
  this.center = world.center;
  this.regionSize = world.regionSize;
  this.chunkSize = world.chunkSize;

  // world data
  this.entities = world.entities;
  this.regions = world.regions;
}

World.prototype.cache = function (type, data) {
  switch (type) {
    case 'regions':
      this.regions = data;
      break;
  }
}