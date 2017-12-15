import { WorldModule } from '../worldModule';
import { World, WorldLocation } from '../../common/models';
import { Tile } from '../../common/data/tiles';
import { Automaton, PRNG, Noise, uuid } from '../../common/utils';

export class MapManager {
    worldModule: WorldModule;
    world: World;
    random: PRNG;
    tileMap: Tile[][] = [];
    heatMap: number[][] = [];
    heightMap: number[][] = [];
    automaton: Automaton;
    automatonMap: boolean[][] = [];
    map: WorldLocation[][] = [];

    regionWidth = 32;
    regionHeight = 32;

    constructor (worldModule: WorldModule) {
        this.worldModule = worldModule;
    }

    createMap (world: World) {
        this.world = world;
        this.random = new PRNG(this.world.seed);

        this.generateAutomaton();
        this.generateHeatMap();
        this.generateHeightMap();
        this.generateTileMap();
        this.generateMap();
    }
    generateAutomaton () {
        this.automaton = new Automaton(this.world.width, this.world.height, {
            seed: this.world.seed,
            step: 2
        });
        this.automatonMap = this.automaton.map;
    }
    generateHeatMap () {
        let heatNoise = new Noise();
        for (let x = 0; x < this.world.width; x++) {
            this.heatMap[x] = [];
            for (let y = 0; y < this.world.height; y++) {
                this.heatMap[x][y] = heatNoise.noise2d(x, y);
            }
        }
    }
    generateHeightMap () {
        let heightNoise = new Noise();
        let frequency = 96;
        let amplitude = 128;
        for (let x = 0; x < this.world.width; x++) {
            this.heightMap[x] = [];
            for (let y = 0; y < this.world.height; y++) {
                this.heightMap[x][y] = heightNoise.noise2d(x / frequency, y / frequency) * amplitude;
            }
        }
    }
    generateTileMap () {
        for (let x = 0; x < this.world.width; x++) {
            this.tileMap[x] = [];
            for (let y = 0; y < this.world.height; y++) {
                let tile: Tile;
                if (this.automatonMap[x][y]) {
                    // there is land!
                    let heat = this.heatMap[x][y];
                    let height = this.heightMap[x][y];
                    if (height > 90) {
                        tile = Tile.ROCK;
                    } else if (height > 60) {
                        tile = Tile.GRASS;
                    } else if (height > 30) {
                        tile = Tile.DIRT;
                    } else {
                        tile = Tile.WATER;
                    }
                } else {
                    tile = Tile.NULL;
                }
                this.tileMap[x][y] = tile;
            }
        }
    }
    generateMap() {
        for (let x = 0; x < this.world.width; x++) {
            this.map[x] = [];
            for (let y = 0; y < this.world.height; y++) {
                let land = this.automatonMap[x][y] ? this.automatonMap[x][y] : false;

                // if land, do tile, z, and midpoints calculations
                let z, tile, midpoints;
                if (land) {
                    // calculate heigh
                    tile = this.tileMap[x][y];
                    z = this.heightMap[x][y] ? this.heightMap[x][y] : 0;
                    midpoints = this.getMidpoints(x, y, z);
                }

                let heat = this.heatMap[x][y] ? this.heatMap[x][y] : 0;
                this.map[x][y] = new WorldLocation(
                    x,
                    y,
                    z,
                    land,
                    heat,
                    tile,
                    midpoints
                );
                this.map[x][y].serial = uuid();
            }
        }
    }
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
            let n = this.heightMap[x][y - 1];
            let w = x - 1 >= 0 ? this.heightMap[x - 1][y] : undefined;
            let nw = x - 1 >= 0 ? this.heightMap[x - 1][y - 1] : undefined;
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
            let n = this.heightMap[x][y - 1];
            let ne = x + 1 < this.world.height ? this.heightMap[x + 1][y - 1] : undefined;
            let e = x + 1 < this.world.height ? this.heightMap[x + 1][y] : undefined;
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
            let e = x + 1 < this.world.width ? this.heightMap[x + 1][y] : undefined;
            let se = x + 1 < this.world.width ? this.heightMap[x + 1][y + 1] : undefined;
            let s = this.heightMap[x][y + 1];
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
            let s = this.heightMap[x][y + 1];
            let sw = x - 1 >= 0 ? this.heightMap[x - 1][y + 1] : undefined;
            let w = x - 1 >= 0 ? this.heightMap[x - 1][y] : undefined;
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
    isLocation(x: number, y: number) {
        return x >= 0 && x < this.world.width && y >= 0 && y < this.world.height;
    }
    getRandomLocation() {
        return this.map[5][5];
    }
    getLocation (x: number, y: number) {
        return this.isLocation(x, y) ? this.map[x][y] : undefined;
    }
    canTravelToLocation (location: WorldLocation) {
        return location.land && location.tile !== Tile.ROCK;
    }
    getRegionAt (x: number, y: number) {
        let region: WorldLocation[] = [];
        for (let i = 0, ix = x - this.regionWidth / 2; i < this.regionWidth; i++, ix++) {
            for (let j = 0, iy = y - this.regionHeight / 2; j < this.regionHeight; j++, iy++) {
                let location = this.getLocation(ix, iy);
                if (location) region.push(location);
            }
        }
        return region;
    }
    isLocationInRegion (location: WorldLocation, regionOf: WorldLocation) {
        return location.x < regionOf.x + (this.regionWidth / 2)
            &&  location.x > regionOf.x - (this.regionWidth / 2)
            && location.y < regionOf.y + (this.regionHeight / 2)
            && location.y > regionOf.y - (this.regionHeight / 2);
    }
}