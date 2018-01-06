import { WorldState } from './';

export class World {
    createdAt: Date;
    constructor (
        public seed: string,
        public width: number,
        public height: number
    ) {
        this.createdAt = new Date();
    }
}