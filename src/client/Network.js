const EventManager = require('./EventManager');

module.exports = Server;
function Server (socket) {
    // register receiving events
    this.socket = socket;

    // register network to events
    this.events = EventManager.register('server');

    // receiving events
    this.socket.on('connect', () => this.events.emit('server/connected', this));

    this.socket.on('player/init', (e) => this.events.emit('player/init', e));
    this.socket.on('player/update', (playerEntity) => this.events.emit('player/update', playerEntity));

    this.socket.on('world/init', (world) => this.events.emit('world/init', world));
    this.socket.on('world/world', (wm) => this.events.emit('world/world', wm));
    this.socket.on('world/update', (world) => this.events.emit('world/update', world));

    this.socket.on('debug/maps', (maps) => this.events.emit('debug/maps', maps));

    // outgoing events
    this.events.on('network/send', (event, data) => this.socket.emit(event, data));
}