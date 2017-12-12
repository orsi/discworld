"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WorldLocation {
    constructor(x, y, z, land, tile, heat) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.land = land;
        this.tile = tile;
        this.heat = heat;
    }
    distanceTo(point) {
        return 0;
    }
}
exports.WorldLocation = WorldLocation;
//# sourceMappingURL=location.js.map