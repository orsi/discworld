import { WorldRegion } from '../../common/models';
import { Region, World } from '../components';

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