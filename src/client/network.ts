import { EventManager } from './eventManager';
import * as io from 'socket.io-client';

export class Network {
    events: EventManager;
    socket: SocketIOClient.Socket;

    constructor (events: EventManager) {
        const socket = this.socket = io();
        this.events = events;

        // server socket events
        socket.on('connect', (e: any) => events.emit('network/connected', e));
        socket.on('server/update', (e: any) => events.emit('server/update', e));
        socket.on('entity/update', (e: any) => events.emit('entity/update', e));
        socket.on('world/update', (e: any) => events.emit('world/update', e));

        // client events
        events.on('message', (message: string) => {
            console.log('emitting message to server', message);
            socket.emit('message', message);
        });
    }
    getSocket () { return this.socket; }
}