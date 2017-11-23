import { WorldModule } from '../worldModule';
import { Tile, World } from '../../common/models';
import { Tiles } from '../../common/data/tiles';
import { Automaton, PRNG, Perlin } from '../../common/utils';

export class MapManager {
    worldModule: WorldModule;
    world: World;
    random: PRNG;
    perlin: Perlin;
    tileMap: Tile[][] = [];
    heatMap: number[][] = [];
    heightMap: number[][] = [];
    automaton: Automaton;
    automatonMap: boolean[][] = [];

    regionWidth = 16;
    regionHeight = 16;

    constructor (worldModule: WorldModule) {
        this.worldModule = worldModule;
    }

    createMap (world: World) {
        this.world = world;
        this.random = new PRNG(this.world.seed);
        this.perlin = new Perlin();

        this.generateAutomaton();
        this.generateHeatMap();
        this.generateHeightMap();
        this.generateTileMap();
    }
    generateAutomaton () {
        this.automaton = new Automaton(this.world.width, this.world.height, {
            seed: this.world.seed,
            step: 2
        });
        this.automatonMap = this.automaton.map;
    }
    generateHeatMap () {
        for (let x = 0; x < this.world.width; x++) {
            this.heatMap[x] = [];
            for (let y = 0; y < this.world.height; y++) {
                this.heatMap[x][y] = this.perlin.noise2d(x, y);
            }
        }
    }
    generateHeightMap () {
        for (let x = 0; x < this.world.width; x++) {
            this.heightMap[x] = [];
            for (let y = 0; y < this.world.height; y++) {
                this.heightMap[x][y] = this.perlin.noise2d(x, y);
            }
        }
    }
    generateTileMap () {
        for (let x = 0; x < this.world.width; x++) {
            this.tileMap[x] = [];
            for (let y = 0; y < this.world.height; y++) {
                let tile: Tile;
                if (this.automatonMap[x][y]) {
                    let tileIndex = Math.floor(this.random.range(0, Tiles.length - 1));
                    tile = Tiles[tileIndex];
                } else {
                    tile = Tiles[0];
                }
                this.tileMap[x][y] = tile;
            }
        }
    }
    isLocation(x: number, y: number) {
        return x >= 0 && x < this.world.width && y >= 0 && y < this.world.height;
    }
    getLocation (x: number, y: number) {
        return {
            x: x,
            y: y,
            land:   this.isLocation(x, y) ? this.automatonMap[x][y] : undefined,
            height: this.isLocation(x, y) ? this.heightMap[x][y] : undefined,
            tile:   this.isLocation(x, y) ? this.tileMap[x][y] : undefined,
            heat:   this.isLocation(x, y) ? this.heatMap[x][y] : undefined,
        };
    }
    getRegionAt (x: number, y: number) {
        let region: any[][] = [];
        for (let i = 0, ix = x - 8; i < this.regionWidth; i++, ix++) {
            region[i] = [];
            for (let j = 0, iy = y - 8; j < this.regionHeight; j++, iy++) {
                region[i][j] = this.getLocation(ix, iy);
            }
        }
        return region;
    }
}