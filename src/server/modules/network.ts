import * as http from 'http';
import * as express from 'express';
import * as io from 'socket.io';
import * as path from 'path';

import { Reverie, ReverieModule } from '../reverie';
import { Eventer } from '../core/eventer';

export class Network extends ReverieModule {
  private publicDirectory = path.join(this.reverie.rootDirectory, '../client');
  private httpServer: http.Server;
  private app: express.Application;
  private io: SocketIO.Server;
  private clients: {[key: string]: Client} = {};

  constructor (reverie: Reverie, options?: any) {
    super('network', reverie);

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

    // listen for new client socket connections
    this.io.on('connection', (socket) => {
        const client = new Client(socket, this);
        this.clients[socket.id] = client;
        this.reverie.eventer.emit('network:connection', client);
    });

    // start up http server
    this.httpServer.listen(3000);
    this.reverie.eventer.emit('network initialized');
    this.eventer.on('client:new', (client: Client) => {
      this.reverie.eventer.emit('client:new', client);
    });
  }
  update(delta: number) {}
}

export class Client {
  private _eventer: Eventer;
  get eventer() { return this._eventer; }
  constructor (private socket: SocketIO.Socket, private network: Network) {
    this.socket = socket;
    this._eventer = network.eventer;

    // register received events from client
    this.socket.on('disconnect', () => this.onDisconnect());
    this.socket.on('message', () => this.onMessage());
    this.socket.on('move', () => this.onMove());
    this.socket.on('inspect', () => this.onInspect());
    this.socket.on('interact', () => this.onInteract());

    // emit created event to network events
    this.eventer.emit('client:new', this);
  }
  /**
   * Send a socket event to the connected client.
   * @param event Name of event to send to client
   * @param data Data being sent to client
   */
  send (event: string, data: any) {
    this.socket.emit(event, data);
  }
  /**
   * Client has disconnected from the network.
   */
  onDisconnect () {
    console.log(`Client disconnected ${this}`);
    // client has disconnected from the server
    this.eventer.emit('client/disconnect', this);
  }
  /**
   * Client has sent a message from their terminal input.
   */
  onMessage () {
    this.eventer.emit('client/message', this);
  }
  /**
   * Client is attempting to move to a new location.
   */
  onMove () {
    this.eventer.emit('client/move', this);
  }
  /**
   * Client single-clicked on an object in the world.
   */
  onInspect () {
    this.eventer.emit('client/inspect', this);
  }
  /**
   * Client double-clicked on an object in the world.
   */
  onInteract () {
    this.eventer.emit('client/interact', this);
  }
}