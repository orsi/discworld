/*
 * Reverie
 * an online browser-based simulation
 * created by Jonathon Orsi
 * July 17th, 2017
 *
 * */

 /**
  * Modules
  */
  // config file
const config = require('../reverie.json');
import * as fs from 'fs';
import * as path from 'path';

// server-side modules
import * as terminal from './server/terminal';
import * as network from './server/network';
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
const scripts: Array<ScriptFile> = [];

// require components first scripts
function loadModules (dir: string) {
    fs.lstat(dir, function(err, stat) {
        if (stat.isDirectory()) {
            // we have a directory: do a tree walk
            fs.readdir(dir, function(err, files) {
                for (let i = 0; i < files.length; i++) {
                    loadModules(path.join(dir, files[i]));
                }
            });
        } else {
            const script: ScriptFile = new ScriptFile(dir);
            scripts.push(script);
            require(dir);
        }
    });
}
loadModules(path.resolve(__dirname, './scripts'));

function reverieLoop() {

}

/**
 * Interfaces and Classes
 */
class ScriptFile {
    public id: number;
    constructor(public fileName: string) {}
}