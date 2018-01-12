// Reverie client
// Created by Jonathon Orsi

/** Services */
import * as server from './reverieServer';
import { EventChannel } from '../common/services/eventChannel';

/** Data */
import { State } from './states/state';
import { WorldState, RegionState, LocationState } from './states';
import * as Packets from '../common/data/net';

/** DOM Components  */
import { DOMRenderer } from './dom';
import * as Components from './components';

export class Client {
  events: EventChannel;
  dom: DOMRenderer;

  lastState: State;
  currentState: State;

  lastUpdate = new Date().getTime();
  accumulator = 0;
  ticksPerSecond = 30;
  tickTime = 1000 / this.ticksPerSecond;
  ticks = 0;

  terminal: Components.Terminal;
  conscience: Components.Conscience;
  constructor() {
    const events = this.events = new EventChannel();

    // dom needs to be initiated before components
    this.dom = new DOMRenderer(this);

    // create terminal
    this.terminal = this.dom.addComponent(new Components.Terminal());
    this.terminal.addEventListener('terminal-message', (e: Event) => this.onTerminalMessage(<CustomEvent>e));

    // create server message window
    this.conscience = this.dom.addComponent(new Components.Conscience());

    // register incoming server events
    server.on('server/message', (p: Packets.Server.Message) => this.conscience.print(p.message));
    server.on('client/entity', (p: Packets.Server.ClientEntityPacket) => this.onClientEntity(p));
    server.on('connect', (s: SocketIOClient.Socket) => this.onServerConnect(s));
    server.on('disconnect', (s: SocketIOClient.Socket) => this.onServerDisconnect(s));

    // create states and setup first state
    this.currentState = new WorldState(this);
  }
  onTerminalMessage (e: CustomEvent) {
    server.send(new Packets.Client.Message(e.detail));
  }
  getClientEntity () {
    // return this.entities[this.clientEntitySerial];
  }
  // Events
  clientEntitySerial: string;
  onClientEntity (p: Packets.Server.ClientEntityPacket) {
    console.log(p);
    // set main agent and follow
    this.clientEntitySerial = p.serial;
  }
  update () {// timing
    this.ticks++;
    const now = new Date().getTime();
    const delta = now - this.lastUpdate;
    this.lastUpdate = now;

    if (this.ticks % 100 === 0) {
      console.log(`update - delta: ${delta}ms, acc: ${this.accumulator}, ticktime: ${this.tickTime}`);
    }

    // process queued events
    this.events.process();

    // update state -- 30tps
    this.accumulator += delta;
    while (this.accumulator > this.tickTime) {
      this.currentState.update(delta);
      this.accumulator -= this.tickTime;
    }

    // render frame
    this.dom.render(delta / this.tickTime);

    requestAnimationFrame(() => this.update());
  }
  run () {
    this.update();
  }
  connected: boolean = false;
  onServerConnect (socket: SocketIOClient.Socket) {
    this.connected = true;
  }
  onServerDisconnect (socket: SocketIOClient.Socket) {
    this.connected = false;
  }
}

// on load
document.addEventListener('DOMContentLoaded', function() {
  // initial run
  let reverie = new Client();
  reverie.run();
});
