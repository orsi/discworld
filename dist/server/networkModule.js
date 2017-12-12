"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const express = require("express");
const io = require("socket.io");
const path = require("path");
class NetworkModule {
    constructor(reverie) {
        this.sockets = [];
        const events = this.events = reverie.events;
        this.publicDirectory = path.join(reverie.rootDirectory, '../public');
        // create express application
        this.app = express();
        this.app.use(express.static(this.publicDirectory));
        this.app.get('/', (req, res) => {
            res.sendFile(this.publicDirectory + '/index.html');
        });
        // create the node http server
        this.httpServer = http.createServer(this.app);
        // attach socket server to http server
        this.io = io(this.httpServer);
        // start up http server
        this.httpServer.listen(3000);
        // initial connection socket from client
        this.io.on('connection', (socket) => events.emit('connection', socket));
    }
    broadcast(event, data) {
        console.log(`>> network broadcast '${event}': ${JSON.stringify(data).substr(0, 50)}`);
        this.io.emit(event, data);
    }
}
exports.NetworkModule = NetworkModule;
//# sourceMappingURL=networkModule.js.map