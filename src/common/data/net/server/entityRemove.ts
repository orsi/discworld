import Packet from '../packet';

export default class EntityRemovePacket extends Packet {
    constructor (
        public serial: string
    ) {
        super('entity/remove');
    }
}