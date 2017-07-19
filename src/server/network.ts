import * as io from 'socket.io';
import * as express from 'express';
import * as http from 'http';

import * as EventChannel from './eventChannel';

// configure express and socket.io
// let express = express();
// let express.use(express.static('./public'));

const webServer  = http.createServer();
const socketIO = io(webServer);

// register system to SystemEvents
// let events = ServerEvents.register('network');

const clients: Array<SocketClient> = [];
// listen for new client socket connections
socketIO.on('connection', (socket) => {
  const client = new SocketClient(socket);
  clients.push(client);
});

// events for all systems to use
// let events.on('network/broadcast', (event, data) => {
//   console.log('emitting');
//   let socketServer.emit(event, data);
// })
// let events.on('network/multicast', (clientIds, event, data) => {
//   clientIds.forEach(function (id) {
//     let clients[id].send(event, data);
//   });
// })
// let events.on('network/send', (clientId, event, data) => {
//   let clients[id].send(event, data);
// });

// // emit network initialized
// let events.emit('initialized');

/*
 * SocketClient Object
 * Created when a new client connects to Reverie socket server.
 *
 *  */

class SocketClient {
  private id: string;
  private socket: SocketIO.Socket;

  constructor (socket: SocketIO.Socket) {
    this.id = socket.id;
    this.socket = socket;
    // this.events = ServerEvents.register('client/' + this.id);

    // register received events from client
    this.socket.on('disconnect', () => this.onDisconnect());

    // this.socket.on('player/message', (message) => this.onMessage(message));
    // this.socket.on('player/move', (movement) => this.onMove(movement));
    // this.socket.on('player/inspect', () => this.onInspect());
    // this.socket.on('player/interact', () => this.onInteract());
    // this.socket.on('player/levitate', (levitate) => this.onPlayerLevitate(levitate));

    // this.socket.on('world/world', (wm) => this.onReceiveWorldMap(wm));
  }
  send (event: string, data: any) {
    this.socket.emit(event, data);
  }
  onConnection () {
    // client has connected to the server
    // this.events.emit('client/connection', this);
  }
  onDisconnect () {
    console.log(`Client disconnected ${this}`);
    // client has disconnected from the server
    // this.events.emit('client/disconnect', this);
  }
  onReceive () {}
  // onMessage (message) {
  //   // message is a message sent when a client
  //   // submits input from their terminal
  //   this.events.emit('client/message', this, message);
  // }
  // onMove (movement) {
  //   // move is message sent when a client
  //   // holds down the right mouse button
  //   this.events.emit('client/move', this, movement);
  // }
  // onInspect (message) {
  //   // inspect is a message sent when a client
  //   // single clicks left mouse button
  //   this.events.emit('client/inspect', this, message);
  // }
  // onInteract (message) {
  //   // interact is a message sent when a client
  //   // double clicks left mouse button
  //   this.events.emit('client/interact', this, message);
  // }
  // onPlayerLevitate (levitate) {
  //   // interact is a message sent when a client
  //   // double clicks left mouse button
  //   this.events.emit('player/levitate', this, levitate);
  // }
  // onReceiveWorldMap (wm) {
  //   // world map sent by server
  //   this.events.emit('world/world', this, wm);
  // }
}
