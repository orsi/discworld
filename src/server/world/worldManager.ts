import * as utils from '../../common/utils';
import { REGIONS, ELEMENTS } from '../../common/data/static/';
import { Point3D } from '../../common/data/point3d';
import { World, WorldLocation, Entity, WorldRegion, WorldState } from '../../common/models';
import { RegionController } from './regionController';
import { RegionManager } from './regionManager';

export class WorldManager {
    static MAX_ELEVATION = 128;
    static MAX_REGIONS = 24;
    world: World;
    regionManager: RegionManager;
    hash: string;
    pseudo: utils.Pseudo;
    land: boolean[];
    temperature: number[];
    elevation: number[];
    hydrology: number[];
    elements: ELEMENTS[];
    regions: WorldRegion[];

    constructor (seed: string, width: number, height: number) {
        // this.world = new World(
        //     seed,
        //     width,
        //     height,
        //     WorldState.EMPTY,
        //     new Date()
        // );
        this.hash = utils.sha256(seed);
        this.pseudo = new utils.Pseudo(this.hash);

        // generate base data
        // let generator = new WorldGenerator(this);
        // this.land = generator.generateLand();
        // this.elevation = generator.generateElevation();
        // this.temperature = generator.generateTemperature();
        // this.hydrology = generator.generateHydrology();
        // this.elements = generator.generateElements();
        // this.locations = generator.generateLocations();

        // create models
        // this.regionManager = new RegionManager(this);
        // this.regionManager.createRegions(this.regions);
        // this.regionManager.createLocations(this.locations);

    }
    update (delta: number) {
        // this.world.elapsedTime += delta;
    }
    getNextRandom () {
        return this.pseudo.next();
    }
    getHash (suffix: string) {
        return utils.sha256(this.world.seed + '-' + suffix);
    }
    getAutomaton (seed: string, width: number, height: number) {
        return new utils.Automaton(this.getHash(seed), width, height);
    }
    getPseudo (seed: string) {
        return new utils.Pseudo(this.getHash(seed));
    }
    getNoise (seed: string) {
        return new utils.Noise(this.getHash(seed));
    }
    getRandomLocation() {
        return new Point3D(
            Math.floor(Math.random() * this.world.width),
            Math.floor(Math.random() * this.world.height),
            Math.floor(Math.random() * WorldManager.MAX_ELEVATION),
        );
    }
    getTime () {
        // return this.world.elapsedTime;
    }
    getWidth () { return this.world.width; }
    getHeight () { return this.world.height; }
    midpoints: { [key: string]: number } = {};
    getMidpoints (x: number, y: number, z: number) {
        // check for pre-calculated vertices
        let leftMidpoint = this.midpoints['x' + x + 'y' + y];
        let topMidpoint = this.midpoints['x' + (x + 1) + 'y' + y];
        let rightMidpoint = this.midpoints['x' + (x + 1) + 'y' + (y + 1)];
        let bottomMidpoint = this.midpoints['x' + x + 'y' + (y + 1)];

        if (typeof leftMidpoint === 'undefined') {
            leftMidpoint = z;
            let leftCount = 1;
            let n = this.elevation[x * (y - 1)];
            let w = x - 1 >= 0 ? this.elevation[(x - 1) * y] : undefined;
            let nw = x - 1 >= 0 ? this.elevation[(x - 1) * (y - 1)] : undefined;
            if (n) {
                leftMidpoint += n;
                leftCount++;
            }
            if (w) {
                leftMidpoint += w;
                leftCount++;
            }
            if (nw) {
                leftMidpoint += nw;
                leftCount++;
            }
            this.midpoints['x' + x + 'y' + y] = leftMidpoint /= leftCount;
        }
        if (typeof topMidpoint === 'undefined') {
            topMidpoint = z;
            let topCount = 1;
            let n = this.elevation[x * (y - 1)];
            let ne = x + 1 < this.world.height ? this.elevation[(x + 1) * (y - 1)] : undefined;
            let e = x + 1 < this.world.height ? this.elevation[(x + 1) * y] : undefined;
            if (n) {
                topMidpoint += n;
                topCount++;
            }
            if (ne) {
                topMidpoint += ne;
                topCount++;
            }
            if (e) {
                topMidpoint += e;
                topCount++;
            }
            this.midpoints['x' + (x + 1) + 'y' + y] = topMidpoint /= topCount;
        }
        if (typeof rightMidpoint === 'undefined') {
            rightMidpoint = z;
            let rightCount = 1;
            let e = x + 1 < this.world.width ? this.elevation[(x + 1) * y] : undefined;
            let se = x + 1 < this.world.width ? this.elevation[(x + 1) * (y + 1)] : undefined;
            let s = this.elevation[x * (y + 1)];
            if (e) {
                rightMidpoint += e;
                rightCount++;
            }
            if (se) {
                rightMidpoint += se;
                rightCount++;
            }
            if (s) {
                rightMidpoint += s;
                rightCount++;
            }
            this.midpoints['x' + (x + 1) + 'y' + (y + 1)] = rightMidpoint /= rightCount;
        }
        if (typeof bottomMidpoint === 'undefined') {
            bottomMidpoint = z;
            let bottomCount = 1;
            let s = this.elevation[x * (y + 1)];
            let sw = x - 1 >= 0 ? this.elevation[(x - 1) * (y + 1)] : undefined;
            let w = x - 1 >= 0 ? this.elevation[(x - 1) * y] : undefined;
            if (s) {
                bottomMidpoint += s;
                bottomCount++;
            }
            if (sw) {
                bottomMidpoint += sw;
                bottomCount++;
            }
            if (w) {
                bottomMidpoint += w;
                bottomCount++;
            }
            this.midpoints['x' + x + 'y' + (y + 1)] = bottomMidpoint /= bottomCount;
        }
        return {
            left: leftMidpoint - z,
            top: topMidpoint - z,
            right: rightMidpoint - z,
            bottom: bottomMidpoint - z
        };
    }
    isPosition(x: number, y: number) {
        return x >= 0 && x < this.world.width && y >= 0 && y < this.world.height;
    }
    canMoveToPosition (x: number, y: number) {
        return this.isPosition(x, y) && this.land[x * y];
    }
    getPosition (x: number, y: number) {
        return this.isPosition(x, y) ? new Point3D(x, y, this.elevation[x * y]) : undefined;
    }

    createEntity() {
        // create entity
        // let entity = this.entityManager.create();

        // // // find a region for entity
        // // let region = this.regionManager.getRegionAtLocation(0, 0);
        // // region.addEntity(entity);

        // return entity;
    }
}