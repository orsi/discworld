import { EventChannel } from '../common/services/eventChannel';
import * as io from 'socket.io-client';

export class Network {
    events: EventChannel;
    server: SocketIOClient.Socket;

    constructor (events: EventChannel) {
        const server = this.server = io();
        this.events = events;

        // server socket events
        server.on('connect',        (data: any) => events.emit('connect', data));
        server.on('client/entity',          (data: any) => events.emit('client/entity', data));
        server.on('world/info',          (data: any) => events.emit('world/info', data));
        server.on('world/map',   (data: any) => events.emit('world/map', data));
        server.on('entity/info',         (data: any) => events.emit('entity/info', data));
        server.on('entity/remove', (data: any) => events.emit('entity/remove', data));
    }
    send (event: string, data?: any) {
        console.log('network send: ', event, data);
        this.server.emit(event, data);
      }
}