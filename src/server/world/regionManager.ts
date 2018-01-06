import { RegionController } from './regionController';
import { WorldManager } from './worldManager';
import { LocationController } from './locationController';
import { WorldRegion, WorldLocation } from '../../common/models';
import { Point3D } from '../../common/data/point3d';

export class RegionManager {
    world: WorldManager;
    regions: RegionController[] = [];
    constructor(world: WorldManager) {
        this.world = world;
    }
    createRegions (regions: WorldRegion[]) {
        regions.forEach(r => {
            this.regions.push(new RegionController(r, this, this.world));
        });
    }
    createLocations (locations: WorldLocation[]) {
        locations.forEach(l => {
            // find which region location is in
            let regionX = l.x % this.world.getWidth();
            let regionY = Math.floor(l.y / this.world.getWidth());

            this.regions.forEach(r => {
                if (r.region.x === regionX && r.region.y === regionY) {
                    r.locations.push(new LocationController(l, r));
                }
            });
        });
    }
    /**
     * Regions
     */
    REGION_SIZE = 32;
    getRegionAtLocation (x: number, y: number) {
        let regionX = Math.floor(x / this.REGION_SIZE);
        let regionY = Math.floor(y / this.REGION_SIZE);
        let regionController = this.regions[regionX * regionY];
        return regionController;
    }
    isPositionInRegion (location: Point3D, regionOf: Point3D) {
        return location.x < regionOf.x + (this.REGION_SIZE / 2)
            &&  location.x > regionOf.x - (this.REGION_SIZE / 2)
            && location.y < regionOf.y + (this.REGION_SIZE / 2)
            && location.y > regionOf.y - (this.REGION_SIZE / 2);
    }
}