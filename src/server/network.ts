import * as http from 'http';
import * as express from 'express';
import * as io from 'socket.io';
import * as path from 'path';

import { Reverie } from './reverie';
import { EventManager } from '../common/eventManager';
import * as ClientPackets from '../common/network/clientPackets';
import * as ServerPackets from '../common/network/serverPackets';

export class Network {
  private publicDirectory = path.join(this.reverie.rootDirectory, '../public');
  private httpServer: http.Server;
  private app: express.Application;
  private io: SocketIO.Server;
  private sockets: SocketIO.Socket[] = [];

  constructor (public events: EventManager, public reverie: Reverie) {

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
      socket.on('disconnect', (data) => events.emit<ClientPackets.Disconnect>('network/disconnect', new ClientPackets.Disconnect(socket, data)));
      socket.on('message', (data) => events.emit<ClientPackets.Message>('network/message', new ClientPackets.Message(socket, data)));
      socket.on('move', (data) => events.emit<ClientPackets.Move>('network/move', new ClientPackets.Move(socket, data)));
      socket.on('look', (data) => events.emit<ClientPackets.Look>('network/look', new ClientPackets.Look(socket, data)));
      socket.on('use', (data) => events.emit<ClientPackets.Use>('network/use', new ClientPackets.Use(socket, data)));

      this.events.emit('network/connection', new ClientPackets.Connection(socket));
    });
  }
  send (socketId: string, event: string, data?: any) {
    let socket = this.getSocket(socketId);
    console.log('sending message from network', event, socket);
    if (socket) socket.emit(event, data);
  }
  broadcast (event: string, data: any) {
    this.io.emit(event, data);
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
