import { LOCATIONS } from '../data/static/locations';

export default class WorldLocation {
    constructor (
        public serial: string,
        public x: number,
        public y: number,
        public z: number,
        public type: LOCATIONS) {}
}