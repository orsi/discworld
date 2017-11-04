import * as http from 'http';
import * as express from 'express';
import * as io from 'socket.io';
import * as path from 'path';

import { Reverie } from './reverie';
import { EventManager } from '../common/eventManager';
import * as NetworkEvents from '../common/network/networkEvents';
import * as ClientPackets from '../common/network/clientPackets';
import { Packet } from '../common/network/packet';

export class Network {
  private publicDirectory: string;
  private httpServer: http.Server;
  private app: express.Application;
  private io: SocketIO.Server;
  private sockets: SocketIO.Socket[] = [];

  constructor (public events: EventManager, rootDir: string) {
    this.publicDirectory = path.join(rootDir, '../public');

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
    this.io.on('connection', (socket) => {
      this.sockets.push(socket);

      // attach socket events
      socket.on('disconnect', (packet: ClientPackets.Disconnect) => events.emit<NetworkEvents.Disconnect>('network/disconnect', new NetworkEvents.Disconnect(socket.id)));
      socket.on('message', (packet: ClientPackets.Message) => events.emit<NetworkEvents.Message>('network/message', new NetworkEvents.Message(socket.id, packet)));
      socket.on('entity/move', (packet: ClientPackets.Move) => events.emit<NetworkEvents.Move>('network/move', new NetworkEvents.Move(socket.id, packet)));
      socket.on('look', (packet: ClientPackets.Look) => events.emit<NetworkEvents.Look>('network/look', new NetworkEvents.Look(socket.id, packet)));
      socket.on('use', (packet: ClientPackets.Use) => events.emit<NetworkEvents.Use>('network/use', new NetworkEvents.Use(socket.id, packet)));

      this.events.emit('network/connection', new NetworkEvents.Connection(socket.id));
    });
  }
  send (socketId: string, event: string, packet?: Packet) {
    let socket = this.getSocket(socketId);
    console.log('send to socket: ', socketId, event, packet);
    if (socket) socket.emit(event, packet);
  }
  broadcast (event: string, packet: Packet) {
    console.log('broadcast: ', event, packet);
    this.io.emit(event, packet);
  }
  multicast (socketIds: string[], event: string, data?: any) {
    for (let i = 0; i < socketIds.length; i++) {
      this.send(socketIds[i], event, data);
    }
  }
  getSocket (socketId: string): SocketIO.Socket | void {
    for (let i = 0; i < this.sockets.length; i++) {
      let socket = this.sockets[i];
      if (socket.id === socketId) return socket;
    }
  }
}
