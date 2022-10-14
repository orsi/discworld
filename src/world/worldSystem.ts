import PRNG from '../utils/prng';
import Automaton from '../utils/automaton';
import Noise from '../utils/noise';
import { sha256 } from '../utils/hash';
import Point3D from '../data/point3d';
import WorldLocation from '../models/worldLocation';
import World from '../models/world';
import Entity from '../models/entity';
import * as generator from './worldGenerator';


export const MAX_ELEVATION = 256;
export const MAX_REGIONS = 24;
export let hash: string;
export let pseudo: PRNG;

export let model: World;
export let worldCreated: boolean = false;
export let entities: { [key: string]: Entity } = {};
export let lastUpdateTime: number = 0;
export let lastUpdatedEventTime: number = 0;
export let pauseStartTime: number = 0;
export let elapsedTime: number = 0;
export let cycles = 0;
export let isUpdating = false;
export let isPaused = false;

export function create(seed: string, width: number, height: number) {
  model = new World();
  model.seed = seed;
  model.width = width;
  model.height = height;
  model.createdAt = new Date();
  // initialize map
  model.map = [];
  for (let x = 0; x < width; x++) {
    model.map[x] = [];
    for (let y = 0; y < height; y++) {
      const loc = new WorldLocation();
      loc.x = x;
      loc.y = y;
      model.map[x][y] = loc;
    }
  }
  generator.generateLand(model);
  generator.generateElevation(model);
  generator.generateTemperature(model);
  generator.generatePrecipitation(model);
  generator.generateBiomes(model);
  worldCreated = true;
  return model;
}
export function update(delta: number) {
  cycles++;
  elapsedTime += delta;
  lastUpdateTime = elapsedTime;
}
export function get() {
  return model;
}
export function destroy() {
  worldCreated = false;
}
export function getNextRandom() {
  return pseudo.random();
}
export function getHash(suffix: string) {
  return sha256(model.seed + '-' + suffix);
}
export function getAutomaton(seed: string, width: number, height: number) {
  return new Automaton(getHash(seed), width, height);
}
export function getPseudo(seed: string) {
  return new PRNG(getHash(seed));
}
export function getNoise(seed: string) {
  return new Noise(getHash(seed));
}
export function getRandomLocation() {
  return new Point3D(
    Math.floor(Math.random() * model.width),
    Math.floor(Math.random() * model.height),
    Math.floor(Math.random() * MAX_ELEVATION),
  );
}
export function getTime() {
  // return this.world.elapsedTime;
}
export function createEntity(id: string) {
  let entity = new Entity();

  // create unique serial for entity
  entity.serial = getHash('client-' + id);
  return entity;

}