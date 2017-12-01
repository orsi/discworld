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
                this.map[x][y] = new WorldLocation(
                    x,
                    y,
                    this.heightMap[x][y] ? this.heightMap[x][y] : 0,
                    this.automatonMap[x][y] ? this.automatonMap[x][y] : false,
                    this.tileMap[x][y] ? this.tileMap[x][y] : Tile.NULL,
                    this.heatMap[x][y] ? this.heatMap[x][y] : 0,
                );
                this.map[x][y].serial = uuid();
            }
        }
    }
    isLocation(x: number, y: number) {
        return x >= 0 && x < this.world.width && y >= 0 && y < this.world.height;
    }
    getLocation (x: number, y: number) {
        return this.isLocation(x, y) ? this.map[x][y] : new WorldLocation(
            x,
            y,
            0,
            false,
            Tile.NULL,
            0
        );
    }
    canTravelToLocation (location: WorldLocation) {
        return location.land && location.tile !== Tile.ROCK;
    }
    getRegionAt (x: number, y: number) {
        let region: any[][] = [];
        for (let i = 0, ix = x - this.regionWidth / 2; i < this.regionWidth; i++, ix++) {
            region[i] = [];
            for (let j = 0, iy = y - this.regionHeight / 2; j < this.regionHeight; j++, iy++) {
                region[i][j] = this.getLocation(ix, iy);
            }
        }
        return region;
    }
    isLocationInRegion (location: WorldLocation, worldLocation: WorldLocation) {
        return location.x < worldLocation.x + (this.regionWidth / 2)
            &&  location.x > worldLocation.x - (this.regionWidth / 2)
            && location.y < worldLocation.y + (this.regionHeight / 2)
            && location.y > worldLocation.y - (this.regionHeight / 2);
    }
}