import { Packet } from '../packet';

export class EntityChatPacket extends Packet {
    constructor (
        public serial: string,
        public message: string
    ) {
        super('entity/chat');
    }
}