import Packet from '../packet';

export default class EntityMove extends Packet {
    constructor (
        public entitySerial: string,
        public x: number,
        public y: number
    ) {
        super('entity/move');
    }
}