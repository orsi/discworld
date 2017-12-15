import { Tile } from '../data/tiles';
import { Point3D } from '../data/point3d';

export class WorldLocation extends Point3D {
    serial: string;
    heat: number;
    land: boolean;
    tile: Tile;
    midpoints: Midpoints;
    constructor (x: number, y: number, z: number = -1, land: boolean, heat: number, tile: Tile = Tile.NULL, midpoints: Midpoints = { top: 0, right: 0, bottom: 0, left: 0}) {
        super(x, y, z);
        this.land = land;
        this.heat = heat;
        this.tile = tile;
        this.midpoints = midpoints;
    }
    distanceTo (point: Point3D) {
        return 0;
    }
}

interface Midpoints {
    top: number;
    right: number;
    bottom: number;
    left: number;
}