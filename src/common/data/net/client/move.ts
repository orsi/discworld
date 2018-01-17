import Packet from '../packet';
import { DIRECTION } from '../../../data/static';
export default class Move extends Packet {
    constructor (
        public direction: DIRECTION
    ) {
        super('client/move');
    }
}