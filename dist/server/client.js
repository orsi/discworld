"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Client {
    constructor(socket, world) {
        this.serial = socket.id;
        this.socket = socket;
        this.world = world;
        // attach socket events
        socket.on('disconnect', () => this.world.onEntityDisconnect(this));
        socket.on('speech', (text) => this.world.onClientSpeech(this, text));
        socket.on('move', (dir) => this.world.onEntityMove(this, dir));
        // socket.on('focus', ( ...args: any[]) => this.world.onEntityFocus(this, ...args));
        // socket.on('interact', ( ...args: any[]) => this.world.onEntityInteract(this, ...args));
        // socket.on('action', ( ...args: any[]) => this.world.onEntityAction(this, ...args));
    }
    send(event, ...args) {
        this.socket.emit(event, ...args);
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map