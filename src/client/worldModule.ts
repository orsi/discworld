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

    if (this.agentMoving && this.elapsedTime - this.lastMove > 200) {
      this.socket.emit('move', this.parseMouseDirection(this.currentMouse.x, this.currentMouse.y));
      this.lastMove = this.elapsedTime;
    }

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
      console.log('create agent', entity);
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
    lastMove: number = 0;
    agentMoving: boolean = false;
    currentMouse: {x: number, y: number} = {x: 0, y: 0};
    onMoveStart (e: MouseEvent) {
      this.agentMoving = true;
      this.currentMouse.x = e.x;
      this.currentMouse.y = e.y;
    }
    onMoveEnd(e: MouseEvent) {
      this.agentMoving = false;
      this.currentMouse.x = e.x;
      this.currentMouse.y = e.y;
    }
    onMouseMove (e: MouseEvent) {
      this.currentMouse.x = e.x;
      this.currentMouse.y = e.y;
    }
    parseMouseDirection (x: number, y: number) {
      let direction = '';

      if (this.isNorth(x, y)) direction += 'n';
      if (this.isEast(x, y)) direction += 'e';
      if (this.isWest(x, y)) direction += 'w';
      if (this.isSouth(x, y)) direction += 's';
      return direction;
  }
  getTheta (x: number, y: number) {
      // translate around origin
      x = x - this.worldComponent.center.x;
      y = y - this.worldComponent.center.y;
      // get angle
      let rad = Math.atan2(-1, 1) - Math.atan2(x, y);
      rad =  rad * 360 / (2 * Math.PI);
      if (rad < 0) rad += 360;
      return rad;
  }
  isNorth(x: number, y: number) {
      let theta = this.getTheta(x, y);
      return  theta >= 30 && theta <= 175;
  }
  isEast(x: number, y: number) {
      let theta = this.getTheta(x, y);
      return theta >= 110 && theta <= 245;
  }
  isWest(x: number, y: number) {
      let theta = this.getTheta(x, y);
      return theta >= 0 && theta <= 55
          || theta >= 280 && theta <= 360;
  }
  isSouth(x: number, y: number) {
      let theta = this.getTheta(x, y);
      return theta >= 225 && theta <= 315;
  }
}