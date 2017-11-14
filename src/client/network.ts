import { EventManager } from '../common/eventManager';
import { Packet } from '../common/network/packet';
import * as io from 'socket.io-client';

export class Network {
    events: EventManager;
    server: SocketIOClient.Socket;

    constructor (events: EventManager) {
        const server = this.server = io();
        this.events = events;

        // server socket events
        server.on('connect',        (data: any) => events.emit('network/connected', data));
        server.on('server',         (data: any) => events.emit('server', data));
        server.on('server/update',  (data: any) => events.emit('server/update', data));
        server.on('agent',          (data: any) => events.emit('agent', data));
        server.on('agent/update',   (data: any) => events.emit('agent/update', data));
        server.on('world',          (data: any) => events.emit('world', data));
        server.on('world/update',   (data: any) => events.emit('world/update', data));
        server.on('entity',         (data: any) => events.emit('entity', data));
        server.on('entity/update',  (data: any) => events.emit('entity/update', data));
        server.on('entity/destroy', (data: any) => events.emit('entity/destroy', data));
        server.on('tile',           (data: any) => events.emit('tile', data));
        server.on('tile/update',    (data: any) => events.emit('tile/update', data));
    }
    send (event: string, packet: Packet) {
        console.log('network send: ', event, packet);
        if (this.server) this.server.emit(event, packet);
      }
}