import { Packet } from '../packet';

export class EntityRemovePacket extends Packet {
    constructor (
        public serial: string
    ) {
        super('entity/remove');
    }
}