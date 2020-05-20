/*
 * Discworld
 * an online browser-based simulation
 * created by Jonathon Orsi
 * July 17th, 2017
 *
 * */

import * as readline from 'readline';
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

import * as discworld from './discworld';
discworld.run();
