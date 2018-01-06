import * as http from 'http';
import * as express from 'express';
import * as io from 'socket.io';
import * as path from 'path';

const publicDir = path.join(require('path').dirname(require!.main!.filename), './public');

// create express application
const app = express();
app.use(express.static(publicDir));
app.get('/', (req, res) => {
    res.sendFile(publicDir + '/index.html');
});

// create the node http server
const httpServer = http.createServer(app);

// attach socket server to http server
const socketServer = io(httpServer);

// start up http server
httpServer.listen(3000);

// keep record of all socket connections
export let sockets: Dictionary<SocketIO.Socket> = {};
socketServer.on('connection', (socket) => {
  sockets[socket.id] = socket;
});
export function on (event: string, cb: (...args: any[]) => void) {
  socketServer.on(event, cb);
}
export function broadcast (event: string, ...args: any[]) {
  socketServer.emit(event, ...args);
}
