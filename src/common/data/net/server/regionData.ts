import { Entity, WorldLocation } from '../../../models/';
import Packet from '../packet';
import { REGIONS } from '../../../data/static';
import { Point3D } from '../../../data/point3d';

export default class RegionData extends Packet {
    constructor (
        public serial: string,
        public type: REGIONS,
        public x: number,
        public y: number,
        public z: number,
        public entities: Entity[],
        public locations: WorldLocation[]
    ) {
        super('region/data');
    }
}