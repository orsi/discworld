import { Packet } from '../packet';
import { Entity } from '../../../../common/models';

export class EntityCreatePacket extends Packet {
    constructor (
        public entity: Entity
    ) {
        super('entity/create');
    }
}