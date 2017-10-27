// Reverie client
// Created by Jonathon Orsi
import { EventManager } from './eventManager';
import { InputManager } from './inputManager';
import { Network } from './network';
import { World } from './world/world';


export class ReverieClient {
  eventManager: EventManager;
  world: World;
  inputManager: InputManager;
  network: Network;
  running = false;
  lastUpdate = new Date().getTime();
  accumulator: number;
  ticksPerSecond = 25;
  tickTime = 1000 / this.ticksPerSecond;
  ticks = 0;

  constructor() {
    // create base event manager
    const events = this.eventManager = new EventManager();

    this.inputManager = new InputManager(events);
    this.network = new Network(events);
    this.world = new World(events);
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
      this.eventManager.processAll();

      // update world
      this.accumulator += delta;
      while (this.accumulator > this.tickTime) {
        this.world.update(this.tickTime);
        this.accumulator -= delta;
      }

      // draw world
      let interpolation = this.accumulator / this.tickTime;
      this.world.draw(interpolation);

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
