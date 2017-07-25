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
    scripts: any;
    public exiting: boolean = false;
    public serverTicks = 0;
    public startTime: Date = new Date();
    public lastUpdate: Date = new Date();
    public lastOutputTime: Date = new Date();
    private running: boolean = false;
    private updateRate: number = 100;
    private updateTimer: NodeJS.Timer;
    private Modules: Array<Module> = [];

    constructor (config?: ReverieConfig) {
        // Setup graceful shutdown
        if (process.platform === 'win32') {
            // if windows, force SIGINT event
            const rl = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.on('close', () => {
                console.log('Win32 close event issued');
                process.emit('SIGINT');
            });
        }

        process.on('SIGINT', () => {
            this.exiting = true;
            console.log('\nExiting Reverie\n');
            process.exit();
        });

        // log
        log.configure(log.LEVELS.DEBUG);

        // eventing channel for modules
        const ev = new EventChannel();

        // register main reverie
        this.EventModule = EventChannel.register('reverie');

        // load base modules
        // terminal
        const terminal = new Terminal();
        this.Modules.push(terminal);

        // load scripts
        this.loadModules(path.resolve(__dirname, './scripts'));

        if (config) {
            // database
            if (config.database) {
                //
            }
            // socket and http server
            if (config.network) {
            //     server.configure(config.server);
            }

            // universe
            if (config.universe) {
                // Universe.configure(config.universe);
            }
        }
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
    loadModules (dir: string): void {
        console.log(dir);
        fs.lstat(dir, (err, stat) => {
            if (err) return;

            if (stat.isDirectory()) {
                // we have a directory: do a tree walk
                fs.readdir(dir, (err, files) => {
                    for (let i = 0; i < files.length; i++) {
                        this.loadModules(path.join(dir, files[i]));
                    }
                });
            } else {
                const script: ScriptFile = new ScriptFile(dir);
                this.scripts.push(script);
                require(dir);
                console.log(`loading script file ${script.fileName}`);
            }
        });
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