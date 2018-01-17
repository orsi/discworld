import Packet from '../packet';
export default class Focus extends Packet {
    constructor () {
        super('client/focus');
    }
}