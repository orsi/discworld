import Packet from '../packet';

export default class MessagePacket extends Packet {
    constructor (
        public message: string
    ) {
        super('server/message');
    }
}