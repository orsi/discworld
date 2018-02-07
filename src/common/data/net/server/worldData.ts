import Packet from '../packet';
import { World } from '../../../models/';

export default class WorldData extends Packet {
    world: World;
    constructor (world: World) {
        super('world/data');
        this.world = world;
    }
}