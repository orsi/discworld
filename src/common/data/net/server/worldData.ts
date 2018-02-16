import Packet from '../packet';
import World from '../../../models/world';

export default class WorldDataPacket extends Packet {
    world: World;
    constructor (world: World) {
        super('world/data');
        this.world = world;
    }
}