"use strict";
/*
 * Reverie
 * an online browser-based simulation
 * created by Jonathon Orsi
 * July 17th, 2017
 *
 * */
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
// Setup graceful shutdown
if (process.platform === 'win32') {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('SIGINT', function () {
        process.emit('SIGINT');
    });
}
process.on('SIGINT', function () {
    process.exit();
});
const reverie_1 = require("./server/reverie");
const reverie = new reverie_1.Reverie();
reverie.run();
//# sourceMappingURL=index.js.map