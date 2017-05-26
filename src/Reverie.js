const Log = require('./server/Log');
let Network = require('./server/Network');
let ServerConsole = require('./server/ServerConsole');
const World = require('./server/World');
const ServerEvents = require('./server/ServerEvents');

const fs = require('fs');
const path = require('path');

module.exports = Reverie;
function Reverie (config) {
    this.Log = log = Log.init(config.log);
    
    this.ServerConsole = ServerConsole.init(config.console);

    // start http/socket server
    this.Network;
    if (config.network) {
        this.Network = new Network(config.network);
    }

    this.World;
    // configure world
    if (config.world) {
        this.World = new World(config.world);
    }

    // require scripts
    this.scripts = [];
    
    // require components first scripts
    let dir = path.resolve(__dirname, './scripts/components');
    let files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
        let script = path.resolve(dir, files[i]);

        if (this.scripts.indexOf(files[i]) === -1) {
            console.log('compiling component script: ' + files[i]);
            this.scripts.push(files[i]);
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

        if (this.scripts.indexOf(files[i]) === -1) {
            console.log('compiling component script: ' + files[i]);
            this.scripts.push(files[i]);
            require(script);
        } else {
            console.log('script "' + files[i] + '" already exists. skipping.');
        }
    }
    console.log('complete. loaded ' + this.scripts.length + ' scripts');

    // register events for subsystems
    this.ServerEvents = ServerEvents.register('reverie');
    this.ServerEvents.on('reverie/world/create', () => {
        this.World.destroy();
        this.World = new World(config.world);
    });
}