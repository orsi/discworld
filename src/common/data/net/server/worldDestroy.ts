import Packet from '../packet';

export default class WorldDestroyPacket extends Packet {
    constructor () {
        super('world/destroy');
    }
}