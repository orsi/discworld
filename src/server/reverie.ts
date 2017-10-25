import * as fs from 'fs';
import * as path from 'path';

import { EventManager } from './core/eventManager';

/**
 * Timer class for executing functions on the server in set
 * intervals.
 */
export class ServerTimer {
    public isActive = true;
    public start = new Date();
    private lastTime = new Date().getTime();
    private cycles = 0;
    private timeRemaining = 0;
    private isOnce = false;
    constructor(private delay: number, private callback: () => void, private once?: boolean) {
        this.timeRemaining = delay;
        this.isOnce = once ? once : false;
    }
    tick() {
        const now = new Date().getTime();
        const elapsed = now - this.lastTime;
        this.lastTime = now;
        this.timeRemaining -= elapsed;
        if (this.timeRemaining <= 0) {
            this.callback();
            console.log('ding!');

            // reset timer if repeating
            if (!this.isOnce) {
                this.timeRemaining = this.delay;
                this.cycles++;
            } else {
                this.isActive = false;
            }
        }
    }
}

interface ReverieSettings {
    terminal: object;
    network: object;
    reverie: object;
    server: object;
}

import { Logger } from './modules/logger';
import { Network } from './modules/network';
import { Terminal } from './modules/terminal';
import { World } from './modules/world';
import { ScriptLoader } from './utils/scriptLoader';

export class Reverie {
    public static instance: Reverie;
    readonly _version = {
        major: 0,
        minor: 0,
        patch: 7
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
        this.events = new EventManager();

        // create network and terminal modules
        this.network = new Network(this.events, this);
        this.world = new World(this.events, this);
        this.terminal = new Terminal(this, {});

        // Load all the scripts in the scripts folder
        console.log('loading command scripts...');
        const scripts = ScriptLoader.load(this.rootDirectory + '/scripts');
        console.log('...finished loading scripts');
    }

    /**
     * Main Reverie application logic loop
     */
    private isRunning = false;
    // Timer-based properties
    private tps = 60;
    private timePerTick = 1000 / this.tps;
    private serverTicks = 0;
    private lastTickDuration = 0;
    private deltas: number[] = [];
    private startTime: Date = new Date();
    private lastUpdate: Date = new Date();
    private reverieLoop: NodeJS.Timer;
    private serverTimers: ServerTimer[] = [];
    private getAverageTickTime() {
        let avg = 0;
        for (let d of this.deltas) {
            avg += d;
        }
        avg = avg / this.deltas.length;
        if (this.deltas.length > 10) this.deltas.pop();
        return avg;
    }
    private update() {
        // update times
        const now = new Date();
        const delta = now.getTime() - this.lastUpdate.getTime();
        this.lastUpdate = now;
        this.lastTickDuration += delta;
        this.deltas.unshift(delta);

        // process server timers
        for (let i = 0, length = this.serverTimers.length; i < length; i++) {
            let timer = this.serverTimers[i];
            if (timer.isActive) timer.tick();
            else this.serverTimers.splice(i, 1);
        }

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
    /**
     * Creates a new world and adds it to the current modules.
     */
    createWorld() {
        // if (this.modules['world']) {
        //     console.log('There can be only one world module.');
        //     return;
        // }
        // this.addModule(new World(this._eventer, this));
    }
    /**
     * Destroys the current world module if it exists.
     */
    destroyWord() {
        // let world = this.getModule<World>('world');
        // if (world) {
        //     world.destroy();
        //     this.removeModule(world.moduleName);
        // } else {
        //     console.log('No world has been created yet');
        // }
    }
}