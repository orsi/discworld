import * as fs from 'fs';
import * as path from 'path';

import { EventManager } from '../common/eventManager';

interface ReverieSettings {
    terminal: object;
    network: object;
    reverie: object;
    server: object;
}

import { Logger } from './logger';
import { Network } from './network';
import { Terminal } from './terminal';
import { World } from './world';
import { ScriptLoader } from '../common/utils/scriptLoader';
import { TimerManager } from '../common/utils/timerManager';
import * as ClientPackets from '../common/network/clientPackets';
import * as ServerPackets from '../common/network/serverPackets';
import * as WorldEvents from '../common/world/worldEvents';

export class Reverie {
    public static instance: Reverie;
    readonly _version = {
        major: 0,
        minor: 0,
        patch: 8
    };
    get version() { return `${this._version.major}.${this._version.minor}.${this._version.patch}`; }

    // root = ~/server/
    private _rootDir = __dirname;
    get rootDirectory() { return this._rootDir; }

    // Main modules
    private events: EventManager;
    private network: Network;
    private terminal: Terminal;
    private world: World;
    socketEntities: SocketEntityList = new SocketEntityList();

    // Timer-based properties
    private isRunning = false;
    private tps = 60;
    private timePerTick = 1000 / this.tps;
    private serverTicks = 0;
    private lastTickDuration = 0;
    private deltas: number[] = [];
    private startTime: Date = new Date();
    private lastUpdate: Date = new Date();
    private reverieLoop: NodeJS.Timer;
    private timers: TimerManager = new TimerManager();
    private getAverageTickTime() {
        let avg = 0;
        for (let d of this.deltas) {
            avg += d;
        }
        avg = avg / this.deltas.length;
        if (this.deltas.length > 10) this.deltas.pop();
        return avg;
    }

    /**
     * Initialization constructor for application.
     * @param config Optional configuration object for Reverie application.
     */
    constructor (config?: ReverieSettings) {
        if (!Reverie.instance) Reverie.instance = this;

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
(v${this.version})`);
        console.log('\n');

        // create Reverie event channel
        const events = this.events = new EventManager();

        // create network and terminal modules
        this.network = new Network(this.events, this);
        this.world = new World(this.events, this);
        this.terminal = new Terminal(this, {});

        // Load all the scripts in the scripts folder
        console.log('loading command scripts...');
        const scripts = ScriptLoader.load(this.rootDirectory + '/scripts');
        console.log('...finished loading scripts');

        // register inter-module events
        events.registerEvent('network/connection', (data) => this.onNetworkConnection(data));
        events.registerEvent('network/disconnect', (data) => this.onNetworkDisconnect(data));
        events.registerEvent('network/move', (data) => this.onNetworkMove(data));
        events.registerEvent('network/message', (data) => this.onNetworkMessage(data));
        events.registerEvent('network/look', (data) => this.onNetworkLook(data));
        events.registerEvent('network/use', (data) => this.onNetworkUse(data));
        events.registerEvent('world', (data) => this.onWorld(data));
        events.registerEvent('world/update', (data) => this.onWorldUpdate(data));
        events.registerEvent('terminal/command', (data) => this.onTerminalCommand(data));
    }

    /**
     * Main Reverie application logic loop
     */
    private update() {
        // update times
        const now = new Date();
        const delta = now.getTime() - this.lastUpdate.getTime();
        this.lastUpdate = now;
        this.lastTickDuration += delta;
        this.deltas.unshift(delta);

        // process server timers
        this.timers.process(delta);

        // process event queue
        this.events.process();

        // update each module
        while (this.lastTickDuration >= this.timePerTick) {
            this.world.update(this.timePerTick);
            this.lastTickDuration -= this.timePerTick;
        }
        this.serverTicks++;
        // asynchronous loop
        if (this.isRunning) {
            this.reverieLoop = setTimeout(() => this.update(), this.timePerTick);
        } else {
            // this.exit();
        }
    }
    /**
     * Begins running the Reverie application loop.
     */
    run() {
        this.isRunning = true;
        this.update();
    }
    /**
     * Pauses execution of Reverie application.
     */
    pause() {
        this.isRunning = false;
    }
    /**
     * Exiting process for application.
     */
    exit() {
        process.exit();
    }

    // Events between modules

    onNetworkConnection (packet: ClientPackets.Connection) {
        const entity = this.world.createEntity();
        this.socketEntities.add(entity.serial, packet.socket.id);
        this.network.send(packet.socket.id, 'agent', new ServerPackets.PlayerEntity(entity));
    }
    onNetworkDisconnect (packet: ClientPackets.Disconnect) {
        const entityId = this.socketEntities.findEntityIdBySocketId(packet.socket.id);
        if (entityId) {
            this.world.removeEntity(entityId);
            this.socketEntities.removeEntity(entityId);
        }
    }
    onNetworkMove (packet: ClientPackets.Move) {
        const entityId = this.socketEntities.findEntityIdBySocketId(packet.socket.id);
        if (entityId) {
            const canMove = this.world.moveEntity(entityId);
            this.network.send(packet.socket.id, 'entity/move', canMove);
        }
    }
    onNetworkMessage (packet: ClientPackets.Message) {
        const entityId = this.socketEntities.findEntityIdBySocketId(packet.socket.id);
        console.log(entityId, packet.socket.id, this.socketEntities);
        if (entityId) {
            this.world.messageEntity(entityId, packet.data);
        }
    }
    onNetworkLook (packet: ClientPackets.Look) {
        const entityId = this.socketEntities.findEntityIdBySocketId(packet.socket.id);
        if (entityId) {
            this.world.lookEntity(entityId);
        }
    }
    onNetworkUse(packet: ClientPackets.Use) {
        const entityId = this.socketEntities.findEntityIdBySocketId(packet.socket.id);
        if (entityId) {
            this.world.interactEntity(entityId);
        }
    }
    onWorld (worldCreated: WorldEvents.Created) {
        this.network.broadcast('world', worldCreated);
    }
    onWorldUpdate (worldUpdate: WorldEvents.Updated) {
        this.network.broadcast('world/update', worldUpdate);
    }
    onTerminalCommand (packet: ClientPackets.Connection) {
        // const entity = this.world.onNewClient();
        // this.socketEntities[entity.serial] = packet.socket.id;
        // packet.socket.send('world/playerEntity', new ServerPackets.PlayerEntity(entity));
    }
}
class SocketEntityList {
    socketEntities: { entityId: string, socketId: string }[] = [];
    constructor() {}
    add (entityId: string, socketId: string) {
        this.socketEntities.push({
            entityId: entityId,
            socketId: socketId
        });
    }
    findEntityIdBySocketId (socketId: string): string | void {
        for (let i = 0; i < this.socketEntities.length; i++) {
            let se = this.socketEntities[i];
            if (se.socketId === socketId) return se.entityId;
        }
    }
    findSocketIdByEntityId (entityId: string): string | void {
        for (let i = 0; i < this.socketEntities.length; i++) {
            let se = this.socketEntities[i];
            if (se.entityId === entityId) return se.socketId;
        }
    }
    removeEntity (entityId: string): boolean {
        for (let i = 0; i < this.socketEntities.length; i++) {
            let se = this.socketEntities[i];
            if (se.entityId === entityId) {
                this.socketEntities.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    removeSocket (socketId: string): boolean {
        for (let i = 0; i < this.socketEntities.length; i++) {
            let se = this.socketEntities[i];
            if (se.socketId === socketId) {
                this.socketEntities.splice(i, 1);
                return true;
            }
        }
        return false;
    }
}