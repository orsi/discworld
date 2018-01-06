import * as fs from 'fs';
import * as path from 'path';

/** Services */
import * as network from './services/network';
import * as events from './services/events';
import * as terminal from './services/terminal';

/** Data */
import * as Packets from '../common/data/net';

import { WorldSystem } from './worldSystem';
import { ScriptLoader } from '../common/utils/scriptLoader';
import { TimerManager } from '../common/utils/timerManager';
import { Client } from './client';

export const version = {
    major: 0,
    minor: 0,
    patch: 20
};

// root = ~/server/
export const _rootdir = __dirname;

// Main systems
let world: WorldSystem;
export function getWorld () { return world; }

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
let timers: TimerManager = new TimerManager();

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
    clients[socket.id] = new Client(socket);

    // attach socket events
    socket.on('client/message', (p: Packets.Client.Message) => onClientMessage(socket.id, p));
}
function onNetworkDisconnect (...args: any[]) {
    console.log(...args);
}
function onClientMessage (id: string, p: Packets.Client.Message) {
    const words = p.message.split(' ');
    if (words.length === 0) return;
    const command = words.shift();
    if (!world) {
        switch (command) {
            case 'create':
                if (words.length >= 3) {
                    const seed = words.shift();
                    if (!seed) return;
                    let width = words.shift();
                    if (!width || isNaN(parseInt(width))) return;
                    let w = parseInt(width);
                    let height = words.shift();
                    if (!height || isNaN(parseInt(height))) return;
                    let h = parseInt(height);
                    world = new WorldSystem(seed, w, h);

                    console.log(`world created: `, world);
                }
            break;
        }
    } else {
        console.log('world is created...', id, p);
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

    // update each module
    if (world) {
        accumulator += delta;
        while (accumulator >= timePerTick) {
            world.update(timePerTick);
            accumulator -= timePerTick;
        }
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