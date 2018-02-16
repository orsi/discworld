import Packet from '../packet';

export default class ClientEntityPacket extends Packet {
    constructor (public serial: string) {
        super('client/entity');
    }
}