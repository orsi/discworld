import { WorldLocation } from '../../common/models';
import { RegionController } from './regionController';

export class LocationController {
    region: RegionController;
    location: WorldLocation;
    constructor (location: WorldLocation, region: RegionController) {
        this.location = location;
        this.region = region;
    }
}