import { WorldState } from './';

export class World {
    createdAt: Date;
    width: number;
    height: number;
    seed: string;
    state: WorldState;
    constructor () {
        this.state = WorldState.EMPTY;
        this.createdAt = new Date();
    }
}