// Reverie client
// Created by Jonathon Orsi
import { ClientUI } from './clientUI';
import { ClientNetworkHandler } from './clientNetworkHandler';
import { WorldModule } from './worldModule';
import { EventChannel } from '../common/services/eventChannel';

export class Client {
  events: EventChannel;
  ui: ClientUI;
  clientNetwork: ClientNetworkHandler;
  world: WorldModule;

  running = false;
  lastUpdate = new Date().getTime();
  accumulator = 0;
  ticksPerSecond = 25;
  tickTime = 1000 / this.ticksPerSecond;
  ticks = 0;

  constructor() {
    const events = this.events = new EventChannel();

    this.world = new WorldModule(events);

    // specialized client classes
    this.ui = new ClientUI(this);
    this.clientNetwork = new ClientNetworkHandler(this);
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
        this.accumulator -= delta;
      }

      // update ui
      this.ui.update(delta);

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
