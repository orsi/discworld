import { WorldState } from './';
import { WorldLocation } from 'common/models/location';

export class World {
    createdAt: Date;
    width: number;
    height: number;
    seed: string;
    state: WorldState;
    map: WorldLocation[][];
    constructor () {
        this.state = WorldState.EMPTY;
        this.createdAt = new Date();
    }
}