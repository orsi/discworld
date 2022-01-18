import * as fs from 'fs';
import * as path from 'path';

/** Services */
import * as network from './services/network';
import * as events from './services/events';
import * as terminal from './services/terminal';

/** Modules */
import * as worldSystem from './worldSystem';
import * as timers from '../common/utils/timerManager';

/** Data */
import Client from './client';
import WorldDataPacket from '../common/data/net/server/worldData';
import WorldDestroyPacket from '../common/data/net/server/worldDestroy';
import MessagePacket from '../common/data/net/server/serverMessage';
import ClientEntityPacket from '../common/data/net/server/clientEntity';

export const version = {
  major: 0,
  minor: 0,
  patch: 22,
};

// root = ~/server/
console.log('dir', __dirname);
export const __rootdir = __dirname;

// Main systems
export function getWorld() {
  return worldSystem.get();
}

/**
 * Begins running the Discworld application loop.
 */
export function run() {
  isRunning = true;
  update();
}
/**
 * Exiting process for application.
 */
export function exit() {
  process.exit();
}
/**
 * Dictionary of all connected clients.
 */
let clients: Dictionary<Client> = {};
export function getClients() {
  return clients;
}
/**
 * Returns a client with given socket id if
 * they are currently connected.
 * @param socketId Socket Id
 */
export function getClient(socketId: string) {
  return clients[socketId];
}

// Timer-based properties
let isRunning = false;
let tps = 60;
let timePerTick = 1000 / tps;
let serverTicks = 0;
let accumulator = 0;
let deltas: number[] = [];
let startTime: Date = new Date();
let lastUpdate = startTime.getTime();
let discworldLoop: NodeJS.Timer;

function getAverageTickTime() {
  let avg = 0;
  for (let d of deltas) {
    avg += d;
  }
  avg = avg / deltas.length;
  if (deltas.length > 10) deltas.pop();
  return avg;
}

/**
 * Initialization constructor for application.
 * @param config Optional configuration object for Discworld application.
 */

function onNetworkConnection(socket: SocketIO.Socket) {
  console.log(`discworld connection: ${socket.id}`);
  // add to client dictionary
  const client = (clients[socket.id] = new Client(socket));

  // send world and entity if exists
  let world = worldSystem.get();
  if (world) {
    client.send(new WorldDataPacket(world));
    let entity = worldSystem.createEntity(client.socket.handshake.address);
    client.send(new ClientEntityPacket(entity.serial));
  }
}
function onNetworkDisconnect(...args: any[]) {
  console.log(...args);
}
export function onClientMessage(client: Client, message: string) {
  if (!message) {
    return;
  }

  if (worldSystem.worldCreated) {
    worldSystem.destroy();
    // broadcast destroy world to all clients
    network.broadcast(new WorldDestroyPacket());
  }

  let width = 250;
  let height = 250;
  let model = worldSystem.create(message, width, height);
  client.send(
    new MessagePacket("Created new world with '" + message + "' seed.")
  );

  // create entities for all connected clients
  for (let serial in clients) {
    let c = clients[serial];
    let entity = worldSystem.createEntity(c.socket.handshake.address);
    c.send(new ClientEntityPacket(entity.serial));
  }

  // broadcast new world to all clients
  network.broadcast(new WorldDataPacket(model));
}
function onTerminalCommand(data: any) {
  // const entity = this.world.onNewClient();
  // this.socketEntities[entity.serial] = packet.socket.id;
  // packet.socket.send('world/playerEntity', new ServerPackets.PlayerEntity(entity));
}

/**
 * Main Discworld application logic loop
 */
function update() {
  // update times
  serverTicks++;
  const now = new Date().getTime();
  const delta = now - lastUpdate;
  lastUpdate = now;

  // process server timers
  timers.process(delta);

  // process event queue
  events.process();

  // update modules
  accumulator += delta;
  while (accumulator >= timePerTick) {
    worldSystem.update(timePerTick);
    accumulator -= timePerTick;
  }

  // asynchronous loop
  if (isRunning) {
    discworldLoop = setTimeout(() => update(), timePerTick);
  } else {
    // this.exit();
  }
}

/**
 * Initialization of Discworld
 */

console.log(`
=====================================================================
     _ _                             _     _
    | (_)                           | |   | |
  __| |_ ___  _____      _____  _ __| | __| |
 / _  | / __|/ __\\ \\ /\\ / / _ \\| '__| |/ _  |
| (_| | \\__ \\ (__ \\ V  V / (_) | |  | | (_| |
 \\__,_|_|___/\\___| \\_/\\_/ \\___/|_|  |_|\\__,_|
=====================================================================
(v${version.major}.${version.minor}.${version.patch})`);
console.log('\n');

// Load all the scripts in the scripts folder
// console.log('loading command scripts...');
// const scripts = ScriptLoader.load(this.rootDirectory + '/scripts');
// console.log('...finished loading scripts');

worldSystem.create('reverie', 250, 250);

// network events
network.on('connection', (socket: SocketIO.Socket) =>
  onNetworkConnection(socket)
);
network.on('disconnect', (data: any) => onNetworkDisconnect(data));

// internal events
events.on('terminal/command', (data) => onTerminalCommand(data));
