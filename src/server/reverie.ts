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
import * as Packets from '../common/data/net';
import { Client } from './client';


export const version = {
    major: 0,
    minor: 0,
    patch: 21
};

// root = ~/server/
export const _rootdir = __dirname;

// Main systems
export function getWorld () {
    return worldSystem.get();
}

/**
 * Begins running the Reverie application loop.
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
export function getClients () { return clients; }
/**
 * Returns a client with given socket id if
 * they are currently connected.
 * @param socketId Socket Id
 */
export function getClient (socketId: string) {
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
let reverieLoop: NodeJS.Timer;

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
 * @param config Optional configuration object for Reverie application.
 */

function onNetworkConnection (socket: SocketIO.Socket) {
    console.log(`reverie connection: ${socket.id}`);
    // add to client dictionary
    const client = clients[socket.id] = new Client(socket);

    // send world and entity if exists
    let world = worldSystem.get();
    if (world) {
        client.send(new Packets.Server.WorldDataPacket(world));
        let entity = worldSystem.createEntity(client.socket.handshake.address);
        client.send(new Packets.Server.ClientEntityPacket(entity.serial));
    }


}
function onNetworkDisconnect (...args: any[]) {
    console.log(...args);
}
export function onClientMessage (client: Client, message: string) {
    const words = message.split(' ');
    if (words.length === 0) return;
    const command = words.shift();

    switch (command) {
        case '/create':
            if (!worldSystem.worldCreated) {
                if (words.length >= 3) {
                    const seed = words.shift();
                    if (!seed) return;
                    let width = words.shift();
                    if (!width || isNaN(parseInt(width))) return;
                    let w = parseInt(width);
                    let height = words.shift();
                    if (!height || isNaN(parseInt(height))) return;
                    let h = parseInt(height);

                    let model = worldSystem.create(seed, w, h);
                    client.send(new Packets.Server.Message('You are filled with imagination.'));

                    // create entities for all connected clients
                    for (let serial in clients) {
                        let c = clients[serial];
                        let entity = worldSystem.createEntity(c.socket.handshake.address);
                        c.send(new Packets.Server.ClientEntityPacket(entity.serial));
                    }

                    // broadcast new world to all clients
                    network.broadcast(new Packets.Server.WorldDataPacket(model));
                } else {
                    client.send(new Packets.Server.Message('You can\'t seem to picture anything.'));
                }
            } else {
                client.send(new Packets.Server.Message('You feel a longing for more.'));
            }
        break;
        case '/destroy':
            if (worldSystem.worldCreated) {
                worldSystem.destroy();
                client.send(new Packets.Server.Message('Your mind has become blank.'));

                // broadcast destroy world to all clients
                network.broadcast(new Packets.Server.WorldDestroy());
            } else {
                client.send(new Packets.Server.Message('You seem perplexed.'));
            }
            break;
        default:
            // send to other clients
            for (let serial in clients) {
                // if (serial === client.socket.id) continue;
                let c = clients[serial];
                c.send(new Packets.Server.Message(`A voice echoes in the distance... "${message}"`));
            }
            break;
    }
}
function onTerminalCommand (data: any) {
    // const entity = this.world.onNewClient();
    // this.socketEntities[entity.serial] = packet.socket.id;
    // packet.socket.send('world/playerEntity', new ServerPackets.PlayerEntity(entity));
}

/**
 * Main Reverie application logic loop
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
        reverieLoop = setTimeout(() => update(), timePerTick);
    } else {
        // this.exit();
    }
}

/**
 * Initialization of Reverie
 */

console.log(`
=====================================================================
ooooooooo.                                             o8o
888    Y88.                                            "
888   .d88'  .ooooo.  oooo    ooo  .ooooo.  oooo d8b oooo   .ooooo.
888ooo88P'  d88'  88b   88.  .8'  d88'  88b  888""8P  888  d88'  88b
888 88b.    888ooo888    88..8'   888ooo888  888      888  888ooo888
888   88b.  888    .o     888'    888    .o  888      888  888    .o
o888o  o888o  Y8bod8P'      8'      Y8bod8P' d888b    o888o  Y8bod8P'
=====================================================================
(v${version.major}.${version.minor}.${version.patch})`);
    console.log('\n');

// Load all the scripts in the scripts folder
// console.log('loading command scripts...');
// const scripts = ScriptLoader.load(this.rootDirectory + '/scripts');
// console.log('...finished loading scripts');

// network events
network.on('connection', (socket: SocketIO.Socket) => onNetworkConnection(socket));
network.on('disconnect', (data: any) => onNetworkDisconnect(data));

// internal events
events.on('terminal/command', (data) => onTerminalCommand(data));