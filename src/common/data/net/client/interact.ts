import Packet from '../packet';

export default class InteractPacket extends Packet {
    constructor (
    ) {
        super('client/interact');
    }
}