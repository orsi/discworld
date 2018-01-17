import Packet from '../packet';

export default class Message extends Packet {
    constructor (
        public message: string
    ) {
        super('client/message');
    }
}