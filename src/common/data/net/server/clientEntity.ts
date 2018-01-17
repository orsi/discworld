import Packet from '../packet';

export default class ClientEntity extends Packet {
    constructor (public serial: string) {
        super('client/entity');
    }
}