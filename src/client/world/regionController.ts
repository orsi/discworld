import { WorldRegion } from '../../common/models';
import { RegionComponent, WorldComponent } from '../components';

export class RegionController {
    region: WorldRegion;
    component: RegionComponent;
    world: WorldComponent;
    elapsedTime: number = 0;
    constructor (world: WorldComponent, region: WorldRegion, component: RegionComponent) {
        this.world = world;
        this.region = region;
        this.component = component;
    }
    update (delta: number) {
        this.elapsedTime += delta;
    }
}