// Reverie client
// Created by Jonathon Orsi
import { EventManager } from '../common/eventManager';
import { InputManager } from './inputManager';
import { Network } from './network';
import { Agent } from './agent';
import { World } from './world';
import { ReverieInterface } from './reverieInterface';
import { Renderer } from './renderer';

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
  accumulator: number;
  ticksPerSecond = 25;
  tickTime = 1000 / this.ticksPerSecond;
  ticks = 0;

  constructor() {
    // create base event manager
    const events = this.events = new EventManager();

    this.inputManager = new InputManager(events);
    this.network = new Network(events);
    this.world = new World(events);

    // create html interface
    this.reverieInterface = new ReverieInterface(events);

    // create renderer for world
    this.renderer = new Renderer(
      this.world,
      this.reverieInterface.worldElement.canvas,
      this.reverieInterface.worldElement.bufferCanvas
    );

    // register inter-module events
    events.registerEvent('input/keyboard/down', (data) => this.onKeyDown(data));
    events.registerEvent('input/window/resize', (data) => this.onWindowResize(data));
    events.registerEvent('terminal/message', (data) => this.onTerminalMessage(data));
    events.registerEvent('server', (data) => this.onServer(data));
    events.registerEvent('server/update', (data) => this.onServerUpdate(data));
    events.registerEvent('agent', (data) => this.onAgent(data));
    events.registerEvent('agent/update', (data) => this.onAgentUpdate(data));
    events.registerEvent('world', (data) => this.onWorld(data));
    events.registerEvent('world/update', (data) => this.onWorldUpdate(data));
    events.registerEvent('entity', (data) => this.onEntity(data));
    events.registerEvent('entity/update', (data) => this.onEntityUpdate(data));
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
        console.log(`last update was ${delta}ms`);
      }

      // process queued events
      this.events.process();

      // update world
      this.accumulator += delta;
      while (this.accumulator > this.tickTime) {
        this.world.update(this.tickTime);
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
  onWindowResize (data: any) {
    this.reverieInterface.getWorldElement().onResize(data);
  }
  onTerminalMessage (data: any) {
    this.network.send('message', data);
  }
  onServer (data: any) {
    console.log(data);
  }
  onServerUpdate (data: any) {
    console.log(data);
  }
  onAgent (data: any) {
    this.agent = data;
  }
  onAgentUpdate (data: any) {
    console.log(data);
  }
  onWorld (data: any) {
    this.world.loadWorld(data);
  }
  onWorldUpdate (data: any) {
    this.world.updateWorld(data);
  }
  onEntity (data: any) {
    this.world.loadEntity(data);
  }
  onEntityUpdate (data: any) {
    this.world.updateEntity(data);
  }
  onTile (data: any) {
    this.world.loadTile(data);
  }
  onTileUpdate (data: any) {
    this.world.updateTile(data);
  }
}

// initial run
let reverie = new ReverieClient();
reverie.run();
