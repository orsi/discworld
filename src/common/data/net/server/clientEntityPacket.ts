import { Packet } from '../packet';

export class ClientEntityPacket extends Packet {
    constructor (public serial: string) {
        super('client/entity');
    }
}