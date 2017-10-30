import { Entity } from '../ecs/entity';

class ServerPacket {
    constructor() {}
}
export class PlayerEntity extends ServerPacket {
    constructor (public entity: Entity) {
        super();
    }
}
export class WorldUpdate extends ServerPacket {
    constructor (public data: any) {
        super();
    }
}
