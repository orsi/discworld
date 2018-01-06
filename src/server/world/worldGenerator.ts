import { WorldManager } from './worldManager';
import { Automaton, Pseudo, Noise, sha256 } from '../../common/utils';
import { ELEMENTS, REGIONS, ENTITIES, LOCATIONS } from '../../common/data/static';
import { WorldRegion, WorldLocation } from '../../common/models';
import { RegionController } from './regionController';

export class WorldGenerator {
    world: WorldManager;
    constructor (world: WorldManager) {
        this.world = world;
    }
    generateLand () {
        if (!this.world) {
            console.log('There is no world to generate land upon yet!');
        }
        let auto = this.world.getAutomaton('automaton', this.world.getWidth(), this.world.getHeight());
        return auto.cells;
    }
    generateElevation () {
        if (!this.world.land) {
            console.log('The world has not generated any land yet to define elevation!');
        }
        let elevation = [];
        let wavelength = 96;
        let amplitude = WorldManager.MAX_ELEVATION;
        let noise = this.world.getNoise('elevation');
        for (let i = 0, max = this.world.getWidth() * this.world.getHeight(); i < max; i++) {
            let x = Math.floor(i % this.world.getWidth());
            let y = Math.floor(i / this.world.getWidth());
            elevation[i] = noise.noise2d(x / wavelength, y / wavelength) * amplitude;
        }
        return elevation;
    }
    generateTemperature () {
        if (!this.world.elevation) {
            console.log('The world has no elevation map to generate temperature on!');
        }
        let temp = [];
        let noise = this.world.getNoise('temperature');
        for (let i = 0, max = this.world.getWidth() * this.world.getHeight(); i < max; i++) {
            let x = Math.floor(i % this.world.getWidth());
            let y = Math.floor(i / this.world.getWidth());
            temp[i] = noise.noise2d(x, y);
        }
        return temp;
    }
    generateHydrology () {
        if (!this.world.temperature || !this.world.elevation) {
            console.log('The world has no temperature or no elevation!');
        }
        let hydro = [];
        let noise = this.world.getNoise('hydrology');
        for (let i = 0, max = this.world.getWidth() * this.world.getHeight(); i < max; i++) {
            let x = Math.floor(i % this.world.getWidth());
            let y = Math.floor(i / this.world.getWidth());
            hydro[i] = noise.noise2d(x, y);
        }
        return hydro;
    }
    /**
     * Creates the elements which can be found within each
     * region generated dependent on the land, elevation,
     * temperature, and hydrology fields.
     */
    generateElements () {
        if (!this.world.temperature || !this.world.elevation) {
            console.log('Cannot create elements with no temperature or elevation!');
        }
        let elements: ELEMENTS[] = [];
        for (let i = 0; i < this.world.getWidth() * this.world.getHeight(); i++) {
            let element: ELEMENTS;
            let height = this.world.elevation[i];
            let heat = this.world.temperature[i];
            if (height > 120) {
                element = ELEMENTS.OXYGEN;
            } else if (height > 60) {
                element = ELEMENTS.HYDROGEN;
            } else if (height > 30) {
                element = ELEMENTS.CARBON;
            } else if (height > 10) {
                element = ELEMENTS.GOLD;
            } else {
                element = ELEMENTS.IRON;
            }
        }
        return elements;
    }
    /**
     * Creates the biomes which depend upon the generated
     * land, elevation, temperature, and hydrology fields.
     */
    generateRegions () {
        if (!this.world.elevation || !this.world.hydrology) {
            console.log('Cannot create regions when there is no elevation or hydrology!');
        }
        let regions: WorldRegion[] = [];
        for (let i = 0; i < this.world.getWidth() * this.world.getHeight(); i++) {
            let regionType: REGIONS;
            if (this.world.elevation[i] > 120) {
                regionType = REGIONS.HILLS;
            } else if (this.world.elevation[i] > 80 && this.world.hydrology[i] < 5) {
                regionType = REGIONS.FOREST;
            } else if (this.world.elevation[i] > 40 && this.world.hydrology[i] < 5) {
                regionType = REGIONS.PLAINS;
            } else {
                regionType = REGIONS.SEA;
            }
            let newRegion = new WorldRegion(
                this.world.getHash('region-' + i),
                regionType,
                i % this.world.getWidth(),
                Math.floor(i / this.world.getWidth()),
                this.world.elevation[i]
            );
            regions[i] = newRegion;
        }
        return regions;
    }
    /**
     * Creates the synthesized location of each cell
     * in the created world.
     */
    generateLocations() {
        if (!this.world.regions || !this.world.elements) {
            console.log('Cannot create locations with no regions or elements!');
        }
        let locations: WorldLocation[] = [];
        for (let i = 0; i < this.world.getWidth() * this.world.getHeight(); i++) {
            let locationType: LOCATIONS;
            let element = this.world.elements[i];
            if (element === ELEMENTS.CARBON) {
                locationType = LOCATIONS.DIRT;
            } else {
                locationType = LOCATIONS.GRASS;
            }
            locations[i] = new WorldLocation(
                this.world.getHash('location-' + i),
                i % this.world.getWidth(),
                Math.floor(i / this.world.getWidth()),
                this.world.elevation[i],
                locationType
            );
        }
        return locations;
    }
}