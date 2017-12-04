import { Tile } from '../data/tiles';
import { Point3D } from '../data/point3d';

export class WorldLocation implements Point3D {
    serial: string;
    tile: Tile;
    x: number;
    y: number;
    z: number;
    heat: number;
    land: boolean;
    constructor (x: number, y: number, z: number, land: boolean, tile: Tile, heat: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.land = land;
        this.tile = tile;
        this.heat = heat;
    }
    distanceTo (point: Point3D) {
        return 0;
    }
}