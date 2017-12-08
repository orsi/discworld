import { Client } from './client';
import { EventChannel } from '../common/services/eventChannel';
import { World, Entity, WorldLocation } from '../common/models';
import { Tile } from '../common/data/tiles';
import { WorldComponent, TerminalComponent, Component, EntityComponent } from './components/';
import { BaseEntity } from '../common/entities/baseEntity';
import { WorldRenderer } from './world/worldRenderer';
import { Agent } from './agent';

export class WorldModule {
  events: EventChannel;
  socket: SocketIO.Socket;
  mainAgent: Agent;
  world: World;
  renderer: WorldRenderer;
  worldComponent: WorldComponent;
  terminalComponent: TerminalComponent;
  interfaceComponents: Component[] = [];
  locations: { [key: string]: WorldLocation } = {};
  entities: { [key: string]: Agent } = {};
  elapsedTime = 0;

  constructor  (client: Client) {
    const events = this.events = client.events;
    this.renderer = new WorldRenderer(this);
    this.worldComponent = client.dom.addComponent<WorldComponent>(new WorldComponent(this, this.renderer));
    this.terminalComponent = client.dom.addComponent<TerminalComponent>(new TerminalComponent(this));

    events.on('connect', (data) => this.onServerConnect(data));
  }
  update (delta: number) {
    this.elapsedTime += delta;
    for (let serial in this.entities) {
      this.entities[serial].entity.update(delta);
    }
    this.renderer.update(delta);
  }
  destroy () {}

  // Events
  onServerConnect (socket: SocketIO.Socket) {
    this.socket = socket;
    socket.on('client/entity', (data) => this.onAgentEntity(data));
    socket.on('world/info', (data) => this.onInfo(data));
    socket.on('world/location', (data) => this.onLocation(data));
    socket.on('entity/speech', (entity, speech) => this.onAgentSpeech(entity, speech));
    socket.on('entity/move', (data) => this.onAgentMove(data));
    socket.on('entity/remove', (data) => this.onAgentRemove(data));
  }
  onAgentEntity (entity: Entity) {
    console.log('got client', entity.serial);

    // find base entity by serial or create
    let agent = this.getAgent(entity.serial);
    if (!agent) agent = this.createAgent(entity);

    // set main agent and follow
    this.mainAgent = agent;
    this.renderer.follow(this.mainAgent);
  }
  onInfo (world: World) {
    console.log('world info', world);
    this.world = world;
  }
  onLocation (location: WorldLocation) {
    this.locations[location.serial] = location;
    this.worldComponent.addLocationComponent(location);
  }
  onAgentRemove (serial: string) {
    console.log('remove entity', serial);
    this.removeEntity(serial);
  }
  onAgentMove(entity: Entity) {
    let movedAgent = this.getAgent(entity.serial);
    if (!movedAgent) movedAgent = this.createAgent(entity);
    movedAgent.entity.moveTo(entity.location);
  }
  onAgentSpeech (from: string, speech: string) {
    console.log('received entity speech');
    console.log(arguments);
    let e = this.getAgent(from);
    if (!e) return;
    e.entity.speak(speech);
  }
  onTerminalMessage (speech: string) {
      console.log('>> speech sent: ', speech);
      this.socket.emit('speech', speech);
  }

    // Location based functions
    isLocation(x: number, y: number) {
        return x >= 0 && x < this.world.width && y >= 0 && y < this.world.height;
    }

    // Entity based functions
    createAgent (entity: Entity) {
      let newEntity = new BaseEntity(entity);
      let newComponent = this.worldComponent.addEntityComponent(newEntity);
      // attach entity and component to client
      let newAgent = this.entities[entity.serial] = new Agent(this, newEntity, newComponent);
      return newAgent;
    }
    removeEntity (serial: string) {
      this.worldComponent.removeEntityComponent(serial);
      return delete this.entities[serial];
    }
    getAgent (serial: string) {
      return this.entities[serial];
    }
}