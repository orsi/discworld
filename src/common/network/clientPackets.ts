// import { Client } from '../client';
class Packet {
    constructor (public socket: SocketIO.Socket) {}
}
export class Connection extends Packet {
    constructor(public socket: SocketIO.Socket) {
        super(socket);
    }
}
export class Disconnect extends Packet {
    constructor(public socket: SocketIO.Socket, public data: any) {
        super(socket);
    }
}
export class Message extends Packet {
    constructor(public socket: SocketIO.Socket, public data: any) {
        super(socket);
    }
}
export class Move extends Packet {
    constructor(public socket: SocketIO.Socket, public data: any) {
        super(socket);
    }
}
export class Look extends Packet {
    constructor(public socket: SocketIO.Socket, public data: any) {
        super(socket);
    }
}
export class Use extends Packet {
    constructor(public socket: SocketIO.Socket, public data: any) {
        super(socket);
    }
}
