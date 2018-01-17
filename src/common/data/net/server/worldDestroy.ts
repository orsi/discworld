import Packet from '../packet';

export default class WorldDestroy extends Packet {
    constructor () {
        super('world/destroy');
    }
}