import Packet from '../packet';

export default class EntityRemove extends Packet {
    constructor (
        public serial: string
    ) {
        super('entity/remove');
    }
}