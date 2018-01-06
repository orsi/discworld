import { WorldRegion, WorldLocation, Entity } from '../../common/models';
import { WorldManager } from './worldManager';
import { RegionManager } from './regionManager';
import { LocationController } from './locationController';

export class RegionController {
    worldManager: WorldManager;
    regionManager: RegionManager;
    region: WorldRegion;
    // entities: Dictionary<EntityController> = {};
    locations: LocationController[] = [];

    constructor (region: WorldRegion, regionManager: RegionManager, worldManager: WorldManager) {
        this.region = region;
        this.regionManager = regionManager;
        this.worldManager = worldManager;
    }
    // addEntity (ec: EntityController) {
    //     ec.region = this;
    //     this.entities[ec.entity.serial] = ec;
    // }
    // getEntities () {
    //     let entities: Entity[] = [];
    //     for (let serial in this.entities) {
    //         entities.push(this.entities[serial].entity);
    //     }
    //     return entities;
    // }
    getLocations () {
        let locations: WorldLocation[] = [];
        this.locations.forEach(l => locations.push(l.location));
        return locations;
    }
}