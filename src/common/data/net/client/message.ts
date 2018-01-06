import { Packet } from '../packet';

export class Message extends Packet {
    constructor (
        public message: string
    ) {
        super('client/message');
    }
}