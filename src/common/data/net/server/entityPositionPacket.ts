import { Packet } from '../packet';
import { Point3D } from '../../point3d';

export class EntityPositionPacket extends Packet {
    constructor (
        public entitySerial: string,
        public position: Point3D
    ) {
        super('entity/position');
    }
}