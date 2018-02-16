import Packet from '../packet';
import Point3D from '../../../data/point3d';
import Entity from '../../../models/entity';
import WorldLocation from '../../../models/location';
import { REGIONS } from '../../static/regions';

export default class RegionDataPacket extends Packet {
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