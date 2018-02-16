import Packet from '../packet';

export default class EntityMovePacket extends Packet {
    constructor (
        public entitySerial: string,
        public x: number,
        public y: number
    ) {
        super('entity/move');
    }
}