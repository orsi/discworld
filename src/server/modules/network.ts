import * as http from 'http';
import * as express from 'express';
import * as io from 'socket.io';
import * as path from 'path';

import { Reverie } from '../reverie';
import { EventManager } from '../core/eventManager';
import { Client } from './client';
import * as Packets from './network/packets';

export class Network {
  private publicDirectory = path.join(this.reverie.rootDirectory, '../public');
  private httpServer: http.Server;
  private app: express.Application;
  private io: SocketIO.Server;
  private clients: Client[] = [];

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
        const client = new Client(socket, events);
        this.clients.push(client);
        console.log(client);
        this.events.emit('client/connect', client);
    });

    // internal events outbound
    events.on('entity/update', (e) => {
      let client = this.getClient(e.socket.id);
      if (client) client.send('entity/update', { event: 'entity update!' });
    });
    events.on('world/update', (e) => {
      this.clients.forEach(client => client.send('world/update', e));
    });
  }

  getClient (socketId: string): Client | void {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i].socket.id === socketId) return this.clients[i];
    }
  }
}
