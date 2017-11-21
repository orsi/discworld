import { WorldLocation, World } from './';

export class WorldRegion {
    world: World;
    from: WorldLocation;
    to: WorldLocation;
    type: string;
    constructor () {}
}