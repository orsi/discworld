"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Reverie client
// Created by Jonathon Orsi
const eventChannel_1 = require("../common/services/eventChannel");
const worldModule_1 = require("./worldModule");
const networkModule_1 = require("./networkModule");
const dom_1 = require("./dom");
class Client {
    constructor() {
        this.running = false;
        this.lastUpdate = new Date().getTime();
        this.accumulator = 0;
        this.ticksPerSecond = 25;
        this.tickTime = 1000 / this.ticksPerSecond;
        this.ticks = 0;
        const events = this.events = new eventChannel_1.EventChannel();
        // dom needs to be initiated before components
        this.dom = new dom_1.DOMRenderer(this);
        this.network = new networkModule_1.NetworkModule(this);
        this.world = new worldModule_1.WorldModule(this);
    }
    update() {
        if (this.running) {
            // timing
            this.ticks++;
            const now = new Date().getTime();
            const delta = now - this.lastUpdate;
            this.lastUpdate = now;
            if (this.ticks % 100 === 0) {
                console.log(`update - delta: ${delta}ms, acc: ${this.accumulator}, ticktime: ${this.tickTime}`);
            }
            // process queued events
            this.events.process();
            // update
            this.accumulator += delta;
            while (this.accumulator > this.tickTime) {
                this.world.update(this.tickTime);
                this.accumulator -= this.tickTime;
            }
            // send render to dom elements
            this.dom.render(delta / this.tickTime);
            requestAnimationFrame(() => this.update());
        }
    }
    run() {
        this.running = true;
        this.update();
    }
    stop() {
        this.running = false;
    }
}
exports.Client = Client;
document.addEventListener('DOMContentLoaded', function () {
    // initial run
    let reverie = new Client();
    reverie.run();
}, false);
//# sourceMappingURL=client.js.map