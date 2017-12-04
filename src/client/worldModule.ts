import { Client } from './client';
import { EventChannel } from '../common/services/eventChannel';
import { World, Entity, WorldLocation } from '../common/models';
import { Tile } from '../common/data/tiles';
import { WorldComponent, TerminalComponent, Component, EntityComponent } from './components/';
import { BaseEntity } from '../common/entities/baseEntity';
import { WorldRenderer } from './world/worldRenderer';

export class WorldModule {
  events: EventChannel;
  socket: SocketIO.Socket;
  clientEntity: BaseEntity;
  world: World;
  renderer: WorldRenderer;
  worldComponent: WorldComponent;
  terminalComponent: TerminalComponent;
  interfaceComponents: Component[] = [];
  locations: { [key: string]: WorldLocation } = {};
  entities: { [key: string]: BaseEntity } = {};

  constructor  (client: Client) {
    const events = this.events = client.events;
    this.renderer = new WorldRenderer();
    this.worldComponent = client.dom.addComponent<WorldComponent>(new WorldComponent(this, this.renderer));
    this.terminalComponent = client.dom.addComponent<TerminalComponent>(new TerminalComponent(this));

    events.on('connect', (data) => this.onServerConnect(data));
  }
  update (delta: number) {
    for (let serial in this.entities) {
      this.entities[serial].update(delta);
    }
  }
  destroy () {}

  // Events
  onServerConnect (socket: SocketIO.Socket) {
    this.socket = socket;
    socket.on('client/entity', (data) => this.onClientEntity(data));
    socket.on('world/info', (data) => this.onInfo(data));
    socket.on('world/location', (data) => this.onLocation(data));
    socket.on('entity/move', (data) => this.onEntityMove(data));
    socket.on('entity/remove', (data) => this.onEntityRemove(data));
  }
  onClientEntity (entity: Entity) {
    console.log('got client', entity.serial);
    // set origin to client entity
    this.clientEntity = this.getEntity(entity.serial);
    if (!this.clientEntity) this.clientEntity = this.createEntity(entity);
    this.renderer.setWorldCenter(this.clientEntity.location);
  }
  onInfo (world: World) {
    console.log('world info', world);
    this.world = world;
  }
  onLocation (location: WorldLocation) {
    this.locations[location.serial] = location;
    this.worldComponent.addLocationComponent(location);
  }
  onEntityRemove (serial: string) {
    console.log('remove entity', serial);
    this.removeEntity(serial);
  }
  onEntityMove(entity: Entity) {
    let movedEntity = this.getEntity(entity.serial);
    if (!movedEntity) movedEntity = this.createEntity(entity);
    movedEntity.moveTo(entity.location);
    if (movedEntity === this.clientEntity) this.renderer.setWorldCenter(this.clientEntity.location);
  }
  onTerminalMessage (message: string) {
      console.log('>> message sent: ', message);
      this.socket.emit('message', message);
  }

    // Location based functions
    isLocation(x: number, y: number) {
        return x >= 0 && x < this.world.width && y >= 0 && y < this.world.height;
    }

    // Entity based functions
    createEntity (entity: Entity) {
      let newEntity = this.entities[entity.serial] = new BaseEntity(entity);
      // create component for entity
      this.worldComponent.addEntityComponent(newEntity);
      return newEntity;
    }
    removeEntity (serial: string) {
      return delete this.entities[serial];
    }
    getEntity (serial: string) {
      return this.entities[serial];
    }
}