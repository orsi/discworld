const Log = require('./server/Log');
var Network = require('./server/Network');
var ServerConsole = require('./server/ServerConsole');
const World = require('./server/World');
const ServerEvents = require('./server/ServerEvents');

module.exports = Reverie;
function Reverie (config) {
    this.Log = Log.init(config.log);
    
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

    // register events for subsystems
    this.ServerEvents = ServerEvents.register('reverie');
    this.ServerEvents.on('reverie/world/create', () => {
        this.World.destroy();
        this.World = new World(config.world);
    });
}