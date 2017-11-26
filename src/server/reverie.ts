import * as fs from 'fs';
import * as path from 'path';

import { EventChannel } from '../common/services/eventChannel';
import { NetworkModule } from './networkModule';
import { TerminalModule } from './terminalModule';
import { WorldModule } from './worldModule';
import { ScriptLoader } from '../common/utils/scriptLoader';
import { TimerManager } from '../common/utils/timerManager';

export class Reverie {
    public static instance: Reverie;
    readonly version = {
        major: 0,
        minor: 0,
        patch: 18
    };

    // root = ~/server/
    rootDirectory = __dirname;

    // Main modules
    events: EventChannel;
    network: NetworkModule;
    terminal: TerminalModule;
    world: WorldModule;

    // Timer-based properties
    isRunning = false;
    tps = 60;
    timePerTick = 1000 / this.tps;
    serverTicks = 0;
    accumulator = 0;
    deltas: number[] = [];
    startTime: Date = new Date();
    lastUpdate = this.startTime.getTime();
    reverieLoop: NodeJS.Timer;
    timers: TimerManager = new TimerManager();
    getAverageTickTime() {
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
    constructor () {
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
(v${this.version.major}.${this.version.minor}.${this.version.patch})`);
        console.log('\n');

        // create Reverie event channel
        const events = this.events = new EventChannel();

        // create network and terminal modules
        this.network = new NetworkModule(this);
        this.world = new WorldModule(this);
        this.terminal = new TerminalModule(this);

        // Load all the scripts in the scripts folder
        // console.log('loading command scripts...');
        // const scripts = ScriptLoader.load(this.rootDirectory + '/scripts');
        // console.log('...finished loading scripts');

        // to network
        events.on('world', (data) => this.onWorld(data));
        events.on('world/update', (data) => this.onWorldUpdate(data));
        events.on('entity', (data) => this.onEntity(data));
        events.on('entity/update', (data) => this.onEntityUpdate(data));
        events.on('entity/destroy', (data) => this.onEntityDestroy(data));

        // misc
        events.on('terminal/command', (data) => this.onTerminalCommand(data));
    }

    /**
     * Main Reverie application logic loop
     */
    private update() {
        // update times
        this.serverTicks++;
        const now = new Date().getTime();
        const delta = now - this.lastUpdate;
        this.lastUpdate = now;

        // process server timers
        this.timers.process(delta);

        // process event queue
        this.events.process();

        // update each module
        this.accumulator += delta;
        while (this.accumulator >= this.timePerTick) {
            this.world.update(this.timePerTick);
            this.accumulator -= this.timePerTick;
        }

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

    // to Network
    onWorld (data: any) {
        // broadcast new world
        this.network.broadcast('world', data);
    }
    onWorldUpdate (data: any) {
        this.network.broadcast('world/update', data);
    }
    onEntity (data: any) {
        this.network.broadcast('entity', data);
    }
    onEntityUpdate (data: any) {
        this.network.broadcast('entity/update', data);
    }
    onEntityDestroy (data: any) {
        this.network.broadcast('entity/destroy', data);
    }
    onTerminalCommand (data: any) {
        // const entity = this.world.onNewClient();
        // this.socketEntities[entity.serial] = packet.socket.id;
        // packet.socket.send('world/playerEntity', new ServerPackets.PlayerEntity(entity));
    }
}