import { EventManager } from './eventManager';

export class World {
  createdAt: Date;
  cycle: number;
  scale: number;
  seed: number;
  x: number;
  y: number;
  z: number;
  center: number;
  regions: any;
  regionSize: number;
  chunkSize: number;
  lastEvent: Date;
  events: EventManager;
  constructor  (events: EventManager) {
    // world data
    // this.entities = w.entities;
    // this.debug = {
    //   cells: [],
    //   temperature: []
    // };
    // this.maps = {
    //   world: [],
    //   region: [],
    //   area: [],
    //   location: []
    // };
    // this.regions = w.regions;

    // register events
    this.events = events;
    events.on('world/world', (wm) => this.onReceiveWorld(wm));
    events.on('world/region', (region) => this.onReceiveRegion(region));
    events.on('world/area', (area) => this.onReceiveArea(area));
    events.on('world/location', (location) => this.onReceiveLocation(location));
    events.on('debug/maps', (maps) => this.onReceiveDebugMaps(maps));
  }
  // cache = function (type, data) {
  //   switch (type) {
  //     case 'regions':
  //       this.regions = data;
  //       break;
  //   }
  // }
  // get = function (name) {
  //   switch (name) {
  //     case 'world':
  //       return this.maps.world;
  //     case 'debug':
  //       return this.debug.maps;
  //   }
  // }
  onReceiveDebugMaps = function (maps: any) {
    // this.debug.maps = maps;
  };
  onReceiveWorld = function (wm: any) {
    // this.maps.world = wm;
  };
  onReceiveRegion = function (region: any) {};
  onReceiveArea = function (area: any) {};
  onReceiveLocation = function (location: any) {};
}