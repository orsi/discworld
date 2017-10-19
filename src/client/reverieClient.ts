// Reverie client
// Created by Jonathon Orsi
import * as io from 'socket.io-client';
import { EventManager } from './eventManager';
import { InputManager } from './inputManager';
import { Renderer } from './renderer';
import { User } from './user';
import { Network } from './network';
import { World } from './world';


export class ReverieClient {
  world: World;
  network: Network;
  user: User;
  inputManager: InputManager;
  eventManager: EventManager;
  renderer: Renderer;
  running = false;

  constructor() {
    // create base event manager
    this.eventManager = new EventManager();
    this.network = new Network(io(), this.eventManager);
    this.inputManager = new InputManager(<HTMLInputElement>document.querySelector('#terminal'), this.eventManager);

    this.renderer = new Renderer(<HTMLCanvasElement>document.querySelector('#reverie'));

    // create user
    this.user = new User(this.eventManager);
    this.world = new World(this.eventManager);
  }
  update () {
    if (this.running) {
      requestAnimationFrame(() => this.update());
    }
  }
  run () {
    this.running = true;
    this.update();
  }
}

// initial run
let reverie = new ReverieClient();
reverie.run();
