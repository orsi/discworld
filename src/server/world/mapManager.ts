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
        let heatNoise = new Noise(5, 1);
        for (let x = 0; x < this.world.width; x++) {
            this.heatMap[x] = [];
            for (let y = 0; y < this.world.height; y++) {
                this.heatMap[x][y] = heatNoise.noise2d(x, y);
            }
        }
    }
    generateHeightMap () {
        let heightNoise = new Noise(5, 128);
        for (let x = 0; x < this.world.width; x++) {
            this.heightMap[x] = [];
            for (let y = 0; y < this.world.height; y++) {
                this.heightMap[x][y] = heightNoise.noise2d(x, y);
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

                // if land, do height and tile calculation
                let z, tile, slants;
                if (land) {
                    // calculate heigh
                    z = this.heightMap[x][y] ? this.heightMap[x][y] : 0;

                    // neighbours heights
                    let n = this.heightMap[x][y - 1];
                    let ne = x + 1 < this.world.height ? this.heightMap[x + 1][y - 1] : undefined;
                    let e = x + 1 < this.world.height ? this.heightMap[x + 1][y] : undefined;
                    let se = x + 1 < this.world.height ? this.heightMap[x + 1][y + 1] : undefined;
                    let s = this.heightMap[x][y + 1];
                    let sw = x - 1 >= 0 ? this.heightMap[x - 1][y + 1] : undefined;
                    let w = x - 1 >= 0 ? this.heightMap[x - 1][y] : undefined;
                    let nw = x - 1 >= 0 ? this.heightMap[x - 1][y - 1] : undefined;

                    // neighbouring z height calculations
                    let topNeighbourCount = 0;
                    let rightNeighbourCount = 0;
                    let bottomNeighbourCount = 0;
                    let leftNeighbourCount = 0;
                    let topSlant = 0;
                    let rightSlant = 0;
                    let bottomSlant = 0;
                    let leftSlant = 0;
                    if (n) {
                        topSlant += (n - z);
                        topNeighbourCount++;
                        leftSlant += (n - z);
                        leftNeighbourCount++;
                    }
                    if (ne) {
                        topSlant += (ne - z);
                        topNeighbourCount++;
                    }
                    if (e) {
                        topSlant += (e - z);
                        topNeighbourCount++;
                        rightSlant += (e - z);
                        rightNeighbourCount++;
                    }
                    if (se) {
                        rightSlant += (se - z);
                        rightNeighbourCount++;
                    }
                    if (s) {
                        rightSlant += (s - z);
                        rightNeighbourCount++;
                        bottomSlant += (s - z);
                        bottomNeighbourCount++;
                    }
                    if (sw) {
                        bottomSlant += (sw - z);
                        bottomNeighbourCount++;
                    }
                    if (w) {
                        bottomSlant += (w - z);
                        bottomNeighbourCount++;
                        leftSlant += (w - z);
                        leftNeighbourCount++;
                    }
                    if (nw) {
                        leftSlant += (nw - z);
                        leftNeighbourCount++;
                    }
                    // divide Slants by neighbour count for average
                    topSlant /= topNeighbourCount > 0 ? topNeighbourCount : 1;
                    rightSlant /= rightNeighbourCount > 0 ? rightNeighbourCount : 1;
                    bottomSlant /= bottomNeighbourCount > 0 ? bottomNeighbourCount : 1;
                    leftSlant /= leftNeighbourCount > 0 ? leftNeighbourCount : 1;
                    slants = {
                        top: topSlant,
                        right: rightSlant,
                        bottom: bottomSlant,
                        left: leftSlant
                    };
                    tile = this.tileMap[x][y];
                }

                let heat = this.heatMap[x][y] ? this.heatMap[x][y] : 0;
                this.map[x][y] = new WorldLocation(
                    x,
                    y,
                    z,
                    land,
                    heat,
                    tile,
                    slants
                );
                this.map[x][y].serial = uuid();
            }
        }
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