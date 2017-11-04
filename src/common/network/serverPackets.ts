import { Packet } from './packet';
import { Entity } from '../ecs/entity';

export class Agent extends Packet {
    constructor (public entity: Entity) {
        super();
    }
}
export class WorldUpdate extends Packet {
    constructor (public data: any) {
        super();
    }
}
