/** Services */
import * as network from './services/network';
import * as events from './services/events';
import * as reverie from './reverie';

/** Tools */
import * as utils from '../common/utils';
import * as generator from './world/worldGenerator';

/** Data */
import * as Packets from '../common/data/net';
import { Point3D } from '../common/data/point3d';
import { ELEMENTS } from '../common/data/static';
import { World, WorldState, WorldRegion, WorldLocation, Tile, Entity } from '../common/models';

export const MAX_ELEVATION = 255;
export const MAX_REGIONS = 24;
export let hash: string;
export let pseudo: utils.Pseudo;

export let model: World;
export let worldCreated: boolean = false;
export let entities: Dictionary<Entity> = {};
export let lastUpdateTime: number = 0;
export let lastUpdatedEventTime: number = 0;
export let pauseStartTime: number = 0;
export let elapsedTime: number = 0;
export let cycles = 0;
export let isUpdating = false;
export let isPaused = false;

export function create (seed: string, width: number, height: number) {
  model = new World();
  model.seed = seed;
  model.width = width;
  model.height = height;
  model.createdAt = new Date();
  generator.generateLand(model);
  generator.generateElevation(model);
  generator.generateTemperature(model);
  generator.generateHydrology(model);
  worldCreated = true;
  return model;
}
export function update (delta: number) {
  cycles++;
  elapsedTime += delta;
  lastUpdateTime = elapsedTime;
}
export function get () {
  return model;
}
export function destroy () {
  worldCreated = false;
}
export function getNextRandom () {
  return pseudo.next();
}
export function getHash (suffix: string) {
    return utils.sha256(model.seed + '-' + suffix);
}
export function getAutomaton (seed: string, width: number, height: number) {
    return new utils.Automaton(getHash(seed), width, height);
}
export function getPseudo (seed: string) {
    return new utils.Pseudo(getHash(seed));
}
export function getNoise (seed: string) {
    return new utils.Noise(getHash(seed));
}
export function getRandomLocation() {
    return new Point3D(
        Math.floor(Math.random() * model.width),
        Math.floor(Math.random() * model.height),
        Math.floor(Math.random() * MAX_ELEVATION),
    );
}
export function getTime () {
    // return this.world.elapsedTime;
}
export function createEntity (id: string) {
  let entity = new Entity();

  // create unique serial for entity
  entity.serial = getHash('client-' + id);
  return entity;

  // send world information to client
  // let world = this.worldManager.world;
  // client.send(new Packets.Server.WorldDataPacket(
  //   world.seed,
  //   world.width,
  //   world.height,
  //   world.createdAt,
  //   world.elapsedTime,
  //   world.state,
  //   this.worldManager.land,
  //   this.worldManager.temperature,
  //   this.worldManager.elevation,
  //   this.worldManager.hydrology,
  //   this.worldManager.elements,
  //   this.worldManager.regions
  // ));

  // client.onEntity();

  // send the region the client is in
  // let rc = ec.region;
  // client.sendPacket(new Packets.Server.RegionDataPacket(
  //   rc.region.serial,
  //   rc.region.type,
  //   rc.region.x,
  //   rc.region.y,
  //   rc.region.z,
  //   rc.getEntities(),
  //   rc.getLocations()
  // ));

  // send new entity to clients in range
  // for (let serial in this.clients) {
  //   let c = this.clients[serial];
  //   if (this.worldManager.regionManager.isPositionInRegion(position, c.entity.position)) {
  //     c.sendPacket(new Packets.Server.EntityPositionPacket(
  //       client.entity.serial,
  //       client.entity.position
  //     ));
  //   }
  // }
}
export function removeEntity (serial: string) {
  delete entities[serial];
}

export function sendWorldMap () {
  // find avergae tile of world
}

export function onEntityMessage (entity: Entity, message: string) {
  // let command = speech.split(' ');
  // switch (command[0]) {
  //   case '/generate':
  //     this.onCreate();
  //     break;
  //   case '/destroy':
  //     this.destroy();
  //     break;
  //   case '/move':
  //     if (!client.entity) return;
  //     let x, y;
  //     if (command[1]) x = parseInt(command[1]);
  //     if (command[2]) y = parseInt(command[2]);

  //     if (x && y && !isNaN(x) && !isNaN(y)) {
  //       let location = this.maps.getLocation(x, y);
  //       if (!location) return;

  //       client.entity.moveTo(location);
  //       let map = this.maps.getRegionAt(location.x, location.y);
  //       map.forEach(location => client.send('world/location', location));

  //       // send client locations to clients in range
  //       for (let serial in this.clients) {
  //         let to = this.clients[serial];
  //         if (this.maps.isLocationInRegion(to.entity.location, client.entity.location)) {
  //           to.send('entity/move', client.entity);
  //           client.send('entity/move', to.entity);
  //         }
  //       }
  //     }
  //     break;
  //   default:
  //     break;
  // }
  // if (!client.entity) return;
  // client.entity.speak(speech);
  // // send speech to all clients in region
  // for (let serial in this.clients) {
  //   let to = this.clients[serial];
  //   if (this.regions.isPositionInRegion(to.entity.position, client.entity.position)) {
  //     to.send('entity/speech', client.entity.serial, speech);
  //     console.log(`sent entity/speech '${speech}' to ${to.serial}`);
  //   }
  // }
}