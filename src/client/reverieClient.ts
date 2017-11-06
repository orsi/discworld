// Reverie client
// Created by Jonathon Orsi
import { EventManager } from '../common/eventManager';
import { InputManager } from './inputManager';
import { Network } from './network';
import { Agent } from './agent';
import { World } from './world';
import { ReverieInterface } from './reverieInterface';
import { Renderer } from './renderer';
import * as EntityEvents from '../common/ecs/entityEvents';
import * as ClientPackets from '../common/network/clientPackets';
import { WorldModel } from 'common/world/models/worldModel';
import { Entity } from 'common/ecs/entity';

export class ReverieClient {
  agent: Agent;
  events: EventManager;
  inputManager: InputManager;
  network: Network;
  world: World;
  reverieInterface: ReverieInterface;
  renderer: Renderer;
  running = false;
  lastUpdate = new Date().getTime();
  accumulator = 0;
  ticksPerSecond = 25;
  tickTime = 1000 / this.ticksPerSecond;
  ticks = 0;

  constructor() {
    const events = this.events = new EventManager();

    this.agent = new Agent(events);
    this.inputManager = new InputManager(events);
    this.network = new Network(events);
    this.world = new World(events);

    // create html interface
    this.reverieInterface = new ReverieInterface(events);

    // create renderer for world
    this.renderer = new Renderer(
      this.agent,
      this.world,
      this.reverieInterface.worldElement.canvas,
      this.reverieInterface.worldElement.bufferCanvas
    );

    // register inter-module events
    events.registerEvent('input/keyboard/down', (data) => this.onKeyDown(data));
    events.registerEvent('input/mouse/down', (data: MouseEvent) => this.onMouseDown(data));
    events.registerEvent('input/window/resize', (e: Event) => this.onWindowResize(<Window>e.currentTarget));
    events.registerEvent('terminal/message', (message: string) => this.onTerminalMessage(message));
    events.registerEvent('server', (data) => this.onServer(data));
    events.registerEvent('server/update', (data) => this.onServerUpdate(data));
    events.registerEvent('agent', (entitySerial: string) => this.onAgentEntity(entitySerial));
    events.registerEvent('world', (data: WorldModel) => this.onWorld(data));
    events.registerEvent('world/update', (data: WorldModel) => this.onWorldUpdate(data));
    events.registerEvent('entity', (data: Entity) => this.onEntity(data));
    events.registerEvent('entity/update', (data: Entity) => this.onEntityUpdate(data));
    events.registerEvent('entity/destroy', (data: string) => this.onEntityDestroy(data));
    events.registerEvent('tile', (data) => this.onTile(data));
    events.registerEvent('tile/update', (data) => this.onTileUpdate(data));
  }
  update () {
    if (this.running) {
      // timing
      const now = new Date().getTime();
      const delta = now - this.lastUpdate;
      this.lastUpdate = now;

      if (this.ticks % 100 === 0) {
        console.log(`update - delta: ${delta}ms, acc: ${this.accumulator}, ticktime: ${this.tickTime}`);
      }

      // process queued events
      this.events.process();

      // update world
      this.accumulator += delta;
      while (this.accumulator > this.tickTime) {
        this.world.update(this.tickTime);
        this.renderer.update();
        this.accumulator -= delta;
      }

      // draw world
      let interpolation = this.accumulator / this.tickTime;
      this.renderer.render(interpolation);

      this.ticks++;
      // call next update frame
      requestAnimationFrame(() => this.update());
    }
  }
  run () {
    this.running = true;
    this.update();
  }
  stop () {
    this.running = false;
  }

  // Events
  onKeyDown (data: any) {
    this.reverieInterface.getTerminalElement().onKey(data.key);
  }
  onMouseDown (mouseEvent: MouseEvent) {
    console.log(mouseEvent);
    switch (mouseEvent.button) {
      case 2:
        let direction = this.parseMouseDirection(mouseEvent);
        console.log(direction);
        this.network.send('entity/move', direction);
        break;
    }
  }
  onWindowResize (window: Window) {
    this.reverieInterface.getWorldElement().resize(window.innerWidth, window.innerHeight);
    this.renderer.setViewportSize(window.innerWidth, window.innerHeight);
  }
  onTerminalMessage (message: string) {
    this.network.send('entity/message', message);
  }
  onServer (data: any) {
    console.log(data);
  }
  onServerUpdate (data: any) {
    console.log(data);
  }
  onAgentEntity (entitySerial: string) {
    console.log(entitySerial);
    let agentEntity = this.world.entities.getEntityBySerial(entitySerial);
    if (agentEntity) this.agent.setEntity(agentEntity);
  }
  onWorld (world: WorldModel) {
    this.world.loadWorld(world);
  }
  onWorldUpdate (world: WorldModel) {
    this.world.updateWorld(world);
  }
  onEntity (entity: Entity) {
    this.world.addEntity(entity);
  }
  onEntityUpdate (entity: Entity) {
    this.world.updateEntity(entity);
  }
  onEntityDestroy (entitySerial: string) {
    this.world.removeEntity(entitySerial);
  }
  onTile (data: any) {
    this.world.loadTile(data);
  }
  onTileUpdate (data: any) {
    this.world.updateTile(data);
  }

  parseMouseDirection (mouseEvent: MouseEvent) {
    let direction = '';
    let mouseX = mouseEvent.clientX;
    let mouseY = mouseEvent.clientY;
    let width = window.innerWidth;
    let height = window.innerHeight;

    if (mouseY <= Math.floor(height * (1 / 3))) direction += 'n';
    if (mouseY >= Math.floor(height * (2 / 3))) direction += 's';
    if (mouseX >= Math.floor(width * (2 / 3))) direction += 'e';
    if (mouseX <= Math.floor(width * (1 / 3))) direction += 'w';
    return direction;
  }
}

// initial run
let reverie = new ReverieClient();
reverie.run();
