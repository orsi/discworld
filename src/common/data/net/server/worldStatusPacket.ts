import { Packet } from '../packet';
import { WorldState, WorldRegion } from '../../../models/';

export class WorldStatusPacket extends Packet {
    constructor (
        public seed: string,
        public width: number,
        public height: number,
        public createdAt: Date,
        public elapsedTime: number
    ) {
        super('world/status');
    }
}