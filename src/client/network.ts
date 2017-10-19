import { EventManager } from './eventManager';

export class Network {
    socket: SocketIOClient.Socket;
    events: EventManager;
    constructor (socket: SocketIOClient.Socket, events: EventManager) {
        this.socket = socket;
        this.events = events;

        // Server socket events
        socket.on('connect', () => this.events.emit('server/connected', this));
        // socket.on('player/init', (e) => this.events.emit('player/init', e));
        // socket.on('player/update', (playerEntity) => this.events.emit('player/update', playerEntity));
        // socket.on('world/init', (world) => this.events.emit('world/init', world));
        // socket.on('world/world', (wm) => this.events.emit('world/world', wm));
        // socket.on('world/update', (world) => this.events.emit('world/update', world));
        // socket.on('debug/maps', (maps) => this.events.emit('debug/maps', maps));

        // Front-end events
        // events.on('network/send', (event, data) => this.socket.emit(event, data));
        events.on('input/message', (message: string) => socket.emit('message', message));
    }
}