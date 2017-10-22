import * as http from 'http';
import * as express from 'express';
import * as io from 'socket.io';
import * as path from 'path';

import { Reverie, ReverieModule } from '../reverie';
import { Eventer } from '../core/eventer';
import * as Packets from './network/packets';

export class Network {
  private publicDirectory = path.join(this.reverie.rootDirectory, '../public');
  private httpServer: http.Server;
  private app: express.Application;
  private io: SocketIO.Server;
  private clients: Client[] = [];

  constructor (public events: Eventer, public reverie: Reverie) {

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
        const client = new Client(socket, events);
        this.clients.push(client);
        console.log(client);
        this.events.emit('client/connect', client);
    });

    // internal events outbound
    events.on('entity/update', (e) => {
      let client = this.getClient(e.socket.id);
      if (client) client.send('entity/update', e);
    });

  }

  getClient (socketId: string): Client | void {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i].socket.id === socketId) return this.clients[i];
    }
  }
}

export class Client {
  events: Eventer;
  socket: SocketIO.Socket;
  constructor (socket: SocketIO.Socket, events: Eventer) {
    this.socket = socket;
    this.events = events;

    // incoming socket events
    socket.on('disconnect', (e: Packets.EntityMessage) => this.events.emit('entity/disconnect', e));
    socket.on('message', (e: Packets.EntityMessage) => this.events.emit('entity/message', e));
    socket.on('move', (e: Packets.EntityMessage) => this.events.emit('entity/move', e));
    socket.on('look', (e) => this.events.emit('entity/look', e));
    socket.on('use', (e) => this.events.emit('entity/use', e));
  }
  /**
   * Send a socket event to the connected client.
   * @param event Name of event to send to client
   * @param data Data being sent to client
   */
  send (event: string, data?: any) {
    this.socket.emit(event, {
      entity: 'hi'
    });
  }
}