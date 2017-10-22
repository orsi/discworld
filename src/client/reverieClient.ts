// Reverie client
// Created by Jonathon Orsi
import { EventManager } from './eventManager';
import { InputManager } from './inputManager';
import { Renderer } from './renderer';
import { User } from './user';
import { Network } from './network';
import { World } from './world';
import { GUI } from './gui';


export class ReverieClient {
  eventManager: EventManager;
  gui: GUI;
  user: User;
  world: World;
  inputManager: InputManager;
  network: Network;
  renderer: Renderer;
  running = false;
  lastUpdate = new Date().getTime();
  ticks = 0;

  constructor() {
    // create base event manager
    const events = this.eventManager = new EventManager();

    // create user
    this.user = new User(events);
    this.world = new World(events);

    this.gui = new GUI(<HTMLElement>document.querySelector('body'), events);
    this.inputManager = new InputManager(events);
    this.network = new Network(events);
    this.renderer = new Renderer(events);
  }
  update () {
    if (this.running) {
      // timing
      const now = new Date().getTime();
      const delta = now - this.lastUpdate;
      this.lastUpdate = now;

      if (this.ticks % 100 === 0) {
        console.log(`last update was ${delta}ms`);
        console.log('channels', this.eventManager.getChannels());
      }
      // process queued events
      this.eventManager.processAll();

      // render output
      this.renderer.render({});

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
}

// initial run
let reverie = new ReverieClient();
reverie.run();
