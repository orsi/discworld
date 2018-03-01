import { BIOMES } from '../data/static/biomes';

export default class WorldLocation {
    x: number;
    y: number;
    z: number;
    land: boolean;
    elevation: number;
    temperature: number;
    precipitation: number;
    biome: BIOMES;
    constructor () {}
}