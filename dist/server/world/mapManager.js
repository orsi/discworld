"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../common/models");
const tiles_1 = require("../../common/data/tiles");
const utils_1 = require("../../common/utils");
class MapManager {
    constructor(worldModule) {
        this.tileMap = [];
        this.heatMap = [];
        this.heightMap = [];
        this.automatonMap = [];
        this.map = [];
        this.regionWidth = 32;
        this.regionHeight = 32;
        this.worldModule = worldModule;
    }
    createMap(world) {
        this.world = world;
        this.random = new utils_1.PRNG(this.world.seed);
        this.generateAutomaton();
        this.generateHeatMap();
        this.generateHeightMap();
        this.generateTileMap();
        this.generateMap();
    }
    generateAutomaton() {
        this.automaton = new utils_1.Automaton(this.world.width, this.world.height, {
            seed: this.world.seed,
            step: 2
        });
        this.automatonMap = this.automaton.map;
    }
    generateHeatMap() {
        let heatNoise = new utils_1.Noise(5, 1);
        for (let x = 0; x < this.world.width; x++) {
            this.heatMap[x] = [];
            for (let y = 0; y < this.world.height; y++) {
                this.heatMap[x][y] = heatNoise.noise2d(x, y);
            }
        }
    }
    generateHeightMap() {
        let heightNoise = new utils_1.Noise(5, 128);
        for (let x = 0; x < this.world.width; x++) {
            this.heightMap[x] = [];
            for (let y = 0; y < this.world.height; y++) {
                this.heightMap[x][y] = heightNoise.noise2d(x, y);
            }
        }
    }
    generateTileMap() {
        for (let x = 0; x < this.world.width; x++) {
            this.tileMap[x] = [];
            for (let y = 0; y < this.world.height; y++) {
                let tile;
                if (this.automatonMap[x][y]) {
                    // there is land!
                    let heat = this.heatMap[x][y];
                    let height = this.heightMap[x][y];
                    if (height > 90) {
                        tile = tiles_1.Tile.ROCK;
                    }
                    else if (height > 60) {
                        tile = tiles_1.Tile.GRASS;
                    }
                    else if (height > 30) {
                        tile = tiles_1.Tile.DIRT;
                    }
                    else {
                        tile = tiles_1.Tile.WATER;
                    }
                }
                else {
                    tile = tiles_1.Tile.NULL;
                }
                this.tileMap[x][y] = tile;
            }
        }
    }
    generateMap() {
        for (let x = 0; x < this.world.width; x++) {
            this.map[x] = [];
            for (let y = 0; y < this.world.height; y++) {
                this.map[x][y] = new models_1.WorldLocation(x, y, this.heightMap[x][y] ? this.heightMap[x][y] : 0, this.automatonMap[x][y] ? this.automatonMap[x][y] : false, this.tileMap[x][y] ? this.tileMap[x][y] : tiles_1.Tile.NULL, this.heatMap[x][y] ? this.heatMap[x][y] : 0);
                this.map[x][y].serial = utils_1.uuid();
            }
        }
    }
    isLocation(x, y) {
        return x >= 0 && x < this.world.width && y >= 0 && y < this.world.height;
    }
    getLocation(x, y) {
        return this.isLocation(x, y) ? this.map[x][y] : new models_1.WorldLocation(x, y, 0, false, tiles_1.Tile.NULL, 0);
    }
    canTravelToLocation(location) {
        return location.land && location.tile !== tiles_1.Tile.ROCK;
    }
    getRegionAt(x, y) {
        let region = [];
        for (let i = 0, ix = x - this.regionWidth / 2; i < this.regionWidth; i++, ix++) {
            region[i] = [];
            for (let j = 0, iy = y - this.regionHeight / 2; j < this.regionHeight; j++, iy++) {
                region[i][j] = this.getLocation(ix, iy);
            }
        }
        return region;
    }
    isLocationInRegion(location, regionOf) {
        return location.x < regionOf.x + (this.regionWidth / 2)
            && location.x > regionOf.x - (this.regionWidth / 2)
            && location.y < regionOf.y + (this.regionHeight / 2)
            && location.y > regionOf.y - (this.regionHeight / 2);
    }
}
exports.MapManager = MapManager;
//# sourceMappingURL=mapManager.js.map