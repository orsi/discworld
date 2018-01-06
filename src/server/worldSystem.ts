/** Services */
import * as network from './services/network';
import * as events from './services/events';
import * as reverie from './reverie';

/** Data */
import * as Packets from '../common/data/net';


import { World, WorldState, WorldRegion, WorldLocation, Tile, Entity } from '../common/models';
import { Pseudo, uuid } from '../common/utils';
import { Client } from './client';

// new
import { WorldGenerator } from './world/worldGenerator';
import { WorldManager } from './world/worldManager';
import { RegionManager } from './world/regionManager';
import { ClientEntity } from './clientEntity';

export class WorldSystem {
  model: World;
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

    // create entities for all connected clients
    let clients = reverie.getClients();
    for (let key in clients) {
      this.createClientEntity(clients[key]);
    }
  }
  update (delta: number) {
    this.cycles++;
    this.elapsedTime += delta;
    this.lastUpdateTime = this.elapsedTime;
  }
  createClientEntity (client: Client) {
    let entity = client.entity = new Entity();

    // create unique serial for entity
    // world seed + client socket
    console.log(client.socket.handshake.address);
    let clientIp = client.socket.handshake.address;
    entity.serial = this.model.seed + clientIp;
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
}