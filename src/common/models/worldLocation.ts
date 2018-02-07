import { BIOMES } from '../data/static/biomes';

export default class WorldLocation {
    land: boolean;
    elevation: number;
    temperature: number;
    precipitation: number;
    biome: BIOMES;
    constructor () {}
}