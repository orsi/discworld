/** Services */
import * as network from './services/network';
import * as events from './services/events';
import * as reverie from './reverie';

/** Data */
import * as Packets from '../common/data/net';
import { Point3D } from '../common/data/point3d';
import { ELEMENTS } from '../common/data/static';

/** Tools */
import * as utils from '../common/utils';

import { World, WorldState, WorldRegion, WorldLocation, Tile, Entity } from '../common/models';
import { Client } from './client';

// new
import { WorldGenerator } from './world/worldGenerator';
import { WorldManager } from './world/worldManager';
import { RegionManager } from './world/regionManager';

export class WorldSystem {
  static MAX_ELEVATION = 128;
  static MAX_REGIONS = 24;
  regionManager: RegionManager;
  hash: string;
  pseudo: utils.Pseudo;

  model: World;
  land: boolean[];
  temperature: number[];
  elevation: number[];
  hydrology: number[];
  elements: ELEMENTS[];
  regions: WorldRegion[];

  entities: Dictionary<Entity> = {};
  lastUpdateTime: number = 0;
  lastUpdatedEventTime: number = 0;
  pauseStartTime: number = 0;
  elapsedTime: number = 0;
  cycles = 0;
  isUpdating = false;
  isPaused = false;

  constructor (seed: string, width: number, height: number) {
    this.model = new World(seed, width, height);
  }
  update (delta: number) {
    this.cycles++;
    this.elapsedTime += delta;
    this.lastUpdateTime = this.elapsedTime;
  }
  getNextRandom () {
    return this.pseudo.next();
  }
  getHash (suffix: string) {
      return utils.sha256(this.model.seed + '-' + suffix);
  }
  getAutomaton (seed: string, width: number, height: number) {
      return new utils.Automaton(this.getHash(seed), width, height);
  }
  getPseudo (seed: string) {
      return new utils.Pseudo(this.getHash(seed));
  }
  getNoise (seed: string) {
      return new utils.Noise(this.getHash(seed));
  }
  getRandomLocation() {
      return new Point3D(
          Math.floor(Math.random() * this.model.width),
          Math.floor(Math.random() * this.model.height),
          Math.floor(Math.random() * WorldManager.MAX_ELEVATION),
      );
  }
  getTime () {
      // return this.world.elapsedTime;
  }
  createClientEntity (client: Client) {
    const entity = client.entity = new Entity();

    // create unique serial for entity
    // world seed + client ip
    console.log(client.socket.handshake.address);
    let clientIp = client.socket.handshake.address;
    entity.serial = this.getHash('client-' + clientIp);
    client.send(new Packets.Server.ClientEntityPacket(entity.serial));

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
  removeClientEntity (client: Client) {
    delete this.entities[client.entity.serial];
  }

  sendWorldMap () {
    // find avergae tile of world
  }

  onEntityMessage (entity: Entity, message: string) {
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
}