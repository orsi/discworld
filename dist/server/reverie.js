"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventChannel_1 = require("../common/services/eventChannel");
const networkModule_1 = require("./networkModule");
const terminalModule_1 = require("./terminalModule");
const worldModule_1 = require("./worldModule");
const timerManager_1 = require("../common/utils/timerManager");
class Reverie {
    /**
     * Initialization constructor for application.
     * @param config Optional configuration object for Reverie application.
     */
    constructor() {
        this.version = {
            major: 0,
            minor: 0,
            patch: 20
        };
        // root = ~/server/
        this.rootDirectory = __dirname;
        // Timer-based properties
        this.isRunning = false;
        this.tps = 60;
        this.timePerTick = 1000 / this.tps;
        this.serverTicks = 0;
        this.accumulator = 0;
        this.deltas = [];
        this.startTime = new Date();
        this.lastUpdate = this.startTime.getTime();
        this.timers = new timerManager_1.TimerManager();
        if (!Reverie.instance)
            Reverie.instance = this;
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
        const events = this.events = new eventChannel_1.EventChannel();
        // create network and terminal modules
        this.network = new networkModule_1.NetworkModule(this);
        this.world = new worldModule_1.WorldModule(this);
        this.terminal = new terminalModule_1.TerminalModule(this);
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
    getAverageTickTime() {
        let avg = 0;
        for (let d of this.deltas) {
            avg += d;
        }
        avg = avg / this.deltas.length;
        if (this.deltas.length > 10)
            this.deltas.pop();
        return avg;
    }
    /**
     * Main Reverie application logic loop
     */
    update() {
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
        }
        else {
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
    onWorld(data) {
        // broadcast new world
        this.network.broadcast('world', data);
    }
    onWorldUpdate(data) {
        this.network.broadcast('world/update', data);
    }
    onEntity(data) {
        this.network.broadcast('entity', data);
    }
    onEntityUpdate(data) {
        this.network.broadcast('entity/update', data);
    }
    onEntityDestroy(data) {
        this.network.broadcast('entity/destroy', data);
    }
    onTerminalCommand(data) {
        // const entity = this.world.onNewClient();
        // this.socketEntities[entity.serial] = packet.socket.id;
        // packet.socket.send('world/playerEntity', new ServerPackets.PlayerEntity(entity));
    }
}
exports.Reverie = Reverie;
//# sourceMappingURL=reverie.js.map