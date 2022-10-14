import WorldRegion from '../models/region';
import World from '../components/region';
import Region from '../components/world';

export default class RegionController {
    region: WorldRegion;
    component: Region;
    world: World;
    elapsedTime: number = 0;
    constructor (world: World, region: WorldRegion, component: Region) {
        this.world = world;
        this.region = region;
        this.component = component;
    }
    update (delta: number) {
        this.elapsedTime += delta;
    }
}