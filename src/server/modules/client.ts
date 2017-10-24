import { EventManager } from '../core/eventManager';
import * as Packets from './network/packets';
import { Entity } from '../core/entities/entity';

export class Client {
    entity: Entity;
    events: EventManager;
    socket: SocketIO.Socket;
    constructor (socket: SocketIO.Socket, events: EventManager) {
      this.socket = socket;
      this.events = events;

      // incoming socket events
      socket.on('disconnect', (e: Packets.ClientMessage) => events.emit('entity/disconnect', e));
      socket.on('message', (data) => events.emit('entity/message', new Packets.ClientMessage(this, data)));
      socket.on('move', (e: Packets.ClientMessage) => events.emit('entity/move', e));
      socket.on('look', (e) => events.emit('entity/look', e));
      socket.on('use', (e) => events.emit('entity/use', e));
    }
    /**
     * Send a socket event to the connected client.
     * @param event Name of event to send to client
     * @param data Data being sent to client
     */
    send (event: string, data?: any) {
      this.socket.emit(event, data);
    }
  }