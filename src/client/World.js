const EventManager = require('./EventManager');

module.exports = World;
function World (w) {
  this.createdAt = w.createdAt;
  this.cycle = w.cycle;
  this.scale = w.scale;
  this.seed = w.seed;
  this.x = w.x;
  this.y = w.y;
  this.z = w.z;
  this.center = w.center;
  this.regions = w.regions;
  this.regionSize = w.regionSize;
  this.chunkSize = w.chunkSize;
  this.lastEvent = Date.now();

  // world data
  this.entities = w.entities;
  this.debug = {
    cells: [],
    temperature: []
  };
  this.maps = {
    world: [],
    region: [],
    area: [],
    location: []
  };
  this.regions = w.regions;

  // register events
  this.events = EventManager.register('world');
  this.events.on('world/world', (wm) => this.onReceiveWorld(wm));
  this.events.on('world/region', (region) => this.onReceiveRegion(region));
  this.events.on('world/area', (area) => this.onReceiveArea(area));
  this.events.on('world/location', (location) => this.onReceiveLocation(location));
  this.events.on('debug/maps', (maps) => this.onReceiveDebugMaps(maps));
}

World.prototype.cache = function (type, data) {
  switch (type) {
    case 'regions':
      this.regions = data;
      break;
  }
}
World.prototype.get = function (name) {
  switch (name) {
    case 'world':
      return this.maps.world;
    case 'debug':
      return this.debug.maps;
  }
}
World.prototype.onReceiveDebugMaps = function (maps) {
  this.debug.maps = maps;
}
World.prototype.onReceiveWorld = function (wm) {
  this.maps.world = wm;
}
World.prototype.onReceiveRegion = function (region) {}
World.prototype.onReceiveArea = function (area) {}
World.prototype.onReceiveLocation = function (location) {}