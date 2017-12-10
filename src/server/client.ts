import { BaseEntity } from '../common/entities/baseEntity';
import { WorldModule } from './worldModule';

export class Client {
    serial: string;
    entity: BaseEntity;
    socket: SocketIO.Socket;
    world: WorldModule;
    constructor (socket: SocketIO.Socket, world: WorldModule) {
        this.serial = socket.id;
        this.socket = socket;
        this.world = world;

        // attach socket events
        socket.on('disconnect', () => this.world.onEntityDisconnect(this));
        socket.on('speech', (text: string) => this.world.onClientSpeech(this, text));
        socket.on('move', (dir: string) => this.world.onEntityMove(this, dir));
        // socket.on('focus', ( ...args: any[]) => this.world.onEntityFocus(this, ...args));
        // socket.on('interact', ( ...args: any[]) => this.world.onEntityInteract(this, ...args));
        // socket.on('action', ( ...args: any[]) => this.world.onEntityAction(this, ...args));
    }
    send (event: string, ...args: any[]) {
        this.socket.emit(event, ...args);
    }
}