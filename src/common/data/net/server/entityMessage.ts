import Packet from '../packet';

export default class EntityMessagePacket extends Packet {
    constructor (
        public serial: string,
        public message: string
    ) {
        super('entity/chat');
    }
}