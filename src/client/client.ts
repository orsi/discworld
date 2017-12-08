// Reverie client
// Created by Jonathon Orsi
import { EventChannel } from '../common/services/eventChannel';
import { WorldModule } from './worldModule';
import { NetworkModule } from './networkModule';
import { DOMRenderer } from './dom';

export class Client {
  events: EventChannel;
  dom: DOMRenderer;
  network: NetworkModule;
  world: WorldModule;

  running = false;
  lastUpdate = new Date().getTime();
  accumulator = 0;
  ticksPerSecond = 25;
  tickTime = 1000 / this.ticksPerSecond;
  ticks = 0;

  constructor() {
    const events = this.events = new EventChannel();

    // dom needs to be initiated before components
    this.dom = new DOMRenderer(this);

    this.network = new NetworkModule(this);
    this.world = new WorldModule(this);
  }
  update () {
    if (this.running) {
      // timing
      this.ticks++;
      const now = new Date().getTime();
      const delta = now - this.lastUpdate;
      this.lastUpdate = now;

      if (this.ticks % 100 === 0) {
        console.log(`update - delta: ${delta}ms, acc: ${this.accumulator}, ticktime: ${this.tickTime}`);
      }

      // process queued events
      this.events.process();

      // update
      this.accumulator += delta;
      while (this.accumulator > this.tickTime) {
        this.world.update(this.tickTime);
        this.accumulator -= this.tickTime;
      }

      // send render to dom elements
      this.dom.render(delta / this.tickTime);

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
document.addEventListener('DOMContentLoaded', function() {
  // initial run
  let reverie = new Client();
  reverie.run();
}, false);
