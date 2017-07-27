import Module from './module';
import * as fs from 'fs';
import * as path from 'path';
import * as log from './log';
import {default as EventChannel, EventModule } from './eventChannel';
import Terminal from './terminal';
import * as network from './network';
import universe from './universe';
// import * as database from ./server/database

/**
 * Reverie server engine
 */
export default class Reverie {
    EventModule: EventModule;
    scripts: Array<ScriptFile> = [];
    public exiting: boolean = false;
    public serverTicks = 0;
    public startTime: Date = new Date();
    public lastUpdate: Date = new Date();
    public lastOutputTime: Date = new Date();
    private running: boolean = false;
    private updateRate: number = 100;
    private updateTimer: NodeJS.Timer;
    private Modules: Array<Module> = [];
    public EventChannel: EventChannel;

    constructor (config?: ReverieConfig) {
        // log
        log.configure(log.LEVELS.DEBUG);

        // register main reverie
        this.EventModule = EventChannel.register('reverie');

        // load base modules
        // terminal
        const terminal = new Terminal();
        this.Modules.push(terminal);

        // load scripts
        const scriptsDirectory = path.resolve(__dirname, '../scripts');
        console.log(`loading all scripts in ${scriptsDirectory}`);
        this.loadScripts(scriptsDirectory, 0);
        console.log(`finished loading ${this.scripts.length} scripts`);

        // if (config) {
        //     // database
        //     if (config.database) {
        //         //
        //     }
        //     // socket and http server
        //     if (config.network) {
        //     //     server.configure(config.server);
        //     }

        //     // universe
        //     if (config.universe) {
        //         // Universe.configure(config.universe);
        //     }
        // }
    }

    tick() {
        // update times
        const now = new Date();
        const delta = now.getTime() - this.lastUpdate.getTime();
        this.lastUpdate = now;

        // output to console every 10th second
        if (now.getTime() % 10000 === 0) {
            console.log(`server ticks ${this.serverTicks}`);
        }

        // process queued events
        EventChannel.flush();

        // update each module
        this.Modules.forEach(module => {
            module.update(delta);
        });

        this.serverTicks++;

        // exit when closing
        if (!this.running) {
            this.updateTimer = setTimeout(() => this.tick(), 1000.0 / this.updateRate);
        }
    }
    start() {
        this.running = true;
        this.tick();
    }
    stop() {
        this.running = false;
    }
    loadScripts (dir: string, level: number): void {
        // indentation for subdirectories
        let indent = '  ';
        for (let i = 0; i < level; i++) {
            indent += indent;
        }

        const base = path.basename(dir);
        const stat = fs.lstatSync(dir);
        if (stat.isDirectory()) {
            // increase indent and read new sub dir
            console.log(`${indent}/${base}`);

            ++level;
            const files = fs.readdirSync(dir);
            for (let i = 0; i < files.length; i++) {
                this.loadScripts(path.join(dir, files[i]), level);
            }
        } else {
            // file found, check if javascript file
            if (path.extname(dir) === '.js') {
                console.log(`${indent}|- ${base}`);

                const script = new ScriptFile(base);
                this.scripts.push(script);
                require(dir);
            }
        }
    }
}

/**
 * Interfaces and Classes
 */

interface ReverieConfig {
    database?: any;
    universe?: any;
    network?: any;
}
class ScriptFile {
    public id: number;
    constructor(public fileName: string) {}
}