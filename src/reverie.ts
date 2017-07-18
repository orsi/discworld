/*
 * Reverie
 * an online browser-based simulation
 * created by Jonathon Orsi
 * July 17th, 2017
 * 
 * */

/**
 * Configuration
 */
let config = require('../reverie.json');

 /**
  * Modules
  */
import * as fs from 'fs';
import * as path from 'path';

/**
 * Server-side modules
 */
import * as terminal from './server/terminal';
import * as server from './server/server';
// import * as universe from './server/universe';

/**
 * Start terminal
 */
if (config.terminal) {
    // terminal.configure(config.terminal);
}

/**
 * Start server
 */
if (config.server) {
//     server.configure(config.server);
}

/**
 * Load universe defaults if exist
 */
if (config.universe) {
    // Universe.configure(config.universe);
}

/**
 * Load Scripts
 */
let scripts: Array<string> = [];

// require components first scripts
let dir = path.resolve(__dirname, './scripts/components');
let files = fs.readdirSync(dir);
for (let i = 0; i < files.length; i++) {
    let script = path.resolve(dir, files[i]);

    if (scripts.indexOf(files[i]) === -1) {
        console.log('compiling component script: ' + files[i]);
        scripts.push(files[i]);
        require(script);
    } else {
        console.log('script "' + files[i] + '" already exists. skipping.');
    }
}
// require entity scripts
dir = path.resolve(__dirname, './scripts/entities');
files = fs.readdirSync(dir);
for (let i = 0; i < files.length; i++) {
    let script = path.resolve(dir, files[i]);

    if (scripts.indexOf(files[i]) === -1) {
        console.log('compiling component script: ' + files[i]);
        scripts.push(files[i]);
        require(script);
    } else {
        console.log('script "' + files[i] + '" already exists. skipping.');
    }
}