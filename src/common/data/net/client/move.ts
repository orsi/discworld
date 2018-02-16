import Packet from '../packet';
import { DIRECTION } from '../../static/direction';

export default class MovePacket extends Packet {
    constructor (
        public direction: DIRECTION
    ) {
        super('client/move');
    }
}