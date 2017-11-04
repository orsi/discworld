import * as ClientPackets from './clientPackets';
class NetworkEvent {
    constructor (public socketId: string) {}
}
export class Connection extends NetworkEvent {
    constructor (socketId: string) {
        super(socketId);
    }
}
export class Move extends NetworkEvent {
    constructor (socketId: string, public packet: ClientPackets.Move) {
        super(socketId);
    }
}
export class Message extends NetworkEvent {
    constructor (socketId: string, public packet: ClientPackets.Message) {
        super(socketId);
    }
}
export class Disconnect extends NetworkEvent {
    constructor (socketId: string) {
        super(socketId);
    }
}
export class Look extends NetworkEvent {
    constructor (socketId: string, public packet: ClientPackets.Look) {
        super(socketId);
    }
}
export class Use extends NetworkEvent {
    constructor (socketId: string, public packet: ClientPackets.Use) {
        super(socketId);
    }
}