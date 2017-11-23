import { Client } from './client';
import { EventChannel } from '../common/services/eventChannel';
import * as io from 'socket.io-client';

export class NetworkModule {
    events: EventChannel;
    server: SocketIOClient.Socket;

    constructor (client: Client) {
        const server = this.server = io();
        const events = this.events = client.events;

        // server socket events
        server.on('connect', (data: any) => events.emit('connect', this.server));
    }
    send (event: string, data?: any) {
        console.log('network send: ', event, data);
        this.server.emit(event, data);
    }
}