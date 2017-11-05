class NetworkEvent {
    constructor (public socketId: string) {}
}
export class Connection extends NetworkEvent {
    constructor (socketId: string) {
        super(socketId);
    }
}
export class Disconnect extends NetworkEvent {
    constructor (socketId: string) {
        super(socketId);
    }
}
export class Move extends NetworkEvent {
    constructor (socketId: string, public direction: string) {
        super(socketId);
    }
}
export class Message extends NetworkEvent {
    constructor (socketId: string, public message: string) {
        super(socketId);
    }
}
export class Look extends NetworkEvent {
    constructor (socketId: string, public objectSerial: string) {
        super(socketId);
    }
}
export class Use extends NetworkEvent {
    constructor (socketId: string, public objectSerial: string) {
        super(socketId);
    }
}