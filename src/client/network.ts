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
        socket.on('agent/created', (data: any) => events.emit('agent/created', data));
        // socket.on('entity/updated', (e: any) => events.emit('entity/update', e));
        // socket.on('entity/destroyed', (e: any) => events.emit('entity/update', e));
        socket.on('entity/created', (data: any) => events.emit('entity/init', data));
        socket.on('entity/updated', (e: any) => events.emit('entity/update', e));
        socket.on('entity/destroyed', (e: any) => events.emit('entity/update', e));
        socket.on('world/created', (data: any) => events.emit('world/created', data));
        socket.on('world/updated', (e: any) => events.emit('world/updated', e));
        socket.on('world/destroyed', (e: any) => console.log(e));
        socket.on('world/info', (e: any) => console.log(e));

        // client events
        events.on('message', (message: string) => {
            console.log('emitting message to server', message);
            socket.emit('message', message);
        });
    }
    getSocket () { return this.socket; }
}