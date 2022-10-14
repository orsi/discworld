import * as dom from './dom';
import Discworld from './components/discworld';
import State from './states/state';
import StartState from './states/start';

/** Call init() on document ready */
document.addEventListener('DOMContentLoaded', function () {
  init();
});
export let clientEntitySerial: string;
export let connected: boolean = false;
export let body: HTMLBodyElement;
export let discworld: Discworld;

let currentState: State;
let running = false;
let accumulator = 0;
let ticks = 0;
const TICKS_PER_SECOND = 30;
const TICK_MS = 1000 / TICKS_PER_SECOND;
let lastUpdate: number;

function init() {
  // give root to dom
  body = <HTMLBodyElement>document.querySelector('body');

  // create discworld
  discworld = new Discworld();
  dom.render(discworld);

  // create initial state
  currentState = new StartState();

  // start update loop
  run();
}

function update() {
  // timing
  ticks++;
  const now = new Date().getTime();
  const delta = now - lastUpdate;
  lastUpdate = now;
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
function pause() {
  running = false;
}
function run() {
  running = true;
  lastUpdate = new Date().getTime();
  update();
}

/** for debug */
declare global {
  interface Window {
    discworld: any;
  }
}
window.discworld = {};
window.discworld.pause = pause;
window.discworld.run = run;
