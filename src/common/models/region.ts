import { REGIONS } from '../data/static/regions';

export default class WorldRegion {
    constructor (
        public serial: string,
        public type: REGIONS,
        public x: number,
        public y: number,
        public z: number
    ) {}
}