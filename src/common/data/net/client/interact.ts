import Packet from '../packet';

export default class Interact extends Packet {
    constructor (
    ) {
        super('client/interact');
    }
}