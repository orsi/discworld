import { Packet } from './packet';

export class Connection extends Packet {
    constructor() {
        super();
    }
}
export class Disconnect extends Packet {
    constructor(public data: any) {
        super();
    }
}
export class Message extends Packet {
    constructor(public message: string) {
        super();
    }
}
export class Move extends Packet {
    constructor(public entitySerial: string, public direction: string) {
        super();
    }
}
export class Look extends Packet {
    constructor(public data: any) {
        super();
    }
}
export class Use extends Packet {
    constructor(public data: any) {
        super();
    }
}
