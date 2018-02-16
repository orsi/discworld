import Packet from '../packet';

export default class FocusPacket extends Packet {
    constructor () {
        super('client/focus');
    }
}