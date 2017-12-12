"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io = require("socket.io-client");
class NetworkModule {
    constructor(client) {
        const server = this.server = io();
        const events = this.events = client.events;
        // server socket events
        server.on('connect', (data) => events.emit('connect', this.server));
    }
    send(event, data) {
        console.log('network send: ', event, data);
        this.server.emit(event, data);
    }
}
exports.NetworkModule = NetworkModule;
//# sourceMappingURL=networkModule.js.map