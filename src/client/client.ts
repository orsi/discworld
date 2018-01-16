/**
 * Reverie - Client entry point
 * Created by Jonathon Orsi
 */

/** Services */
import * as server from './reverieServer';

/** DOM, Components  */
import * as dom from './dom';
import * as Components from './components';
import { Component } from './components/component';

/** Data */
import State from './states/state';
import StartState from './states/start';
import * as Packets from '../common/data/net';

/** Call init() on document ready */
document.addEventListener('DOMContentLoaded', function() {
  init();
});
let lastState: State;
let currentState: State;
export let clientEntitySerial: string;
export let connected: boolean = false;
export let body: HTMLBodyElement;
export let reverie: Components.Reverie;

function init () {
  // give root to dom
  body = <HTMLBodyElement>document.querySelector('body');

  // create reverie
  reverie = new Components.Reverie();
  dom.render(reverie);

  // register incoming server events
  server.on('client/entity', (p: Packets.Server.ClientEntityPacket) => clientEntitySerial = p.serial);
  server.on('connect', (s: SocketIOClient.Socket) => connected = true);
  server.on('disconnect', (s: SocketIOClient.Socket) => connected = false);

  // create initial state
  currentState = new StartState();

  // start update loop
  run();
}

let running = false;
let accumulator = 0;
let ticks = 0;
const TICKS_PER_SECOND = 30;
const TICK_MS = 1000 / TICKS_PER_SECOND;
let lastUpdate: number;
function update () {
  // timing
  ticks++;
  const now = new Date().getTime();
  const delta = now - lastUpdate;
  lastUpdate = now;

  if (ticks % 100 === 0) {
    console.log(`update >> delta: ${delta}ms, acc: ${accumulator}`);
  }

  // update state -- 30tps
  accumulator += delta;
  while (accumulator > TICK_MS) {
    currentState.update(delta);
    accumulator -= TICK_MS;
  }

  // render
  currentState.render(delta / TICK_MS);

  // loop
  if (running) requestAnimationFrame(() => update());
}
function pause () {
  running = false;
}
function run () {
  running = true;
  lastUpdate = new Date().getTime();
  update();
}

/** for debug */
declare global {
  interface Window {
      reverie: any;
  }
}
window.reverie = {};
window.reverie.pause = pause;
window.reverie.run = run;
