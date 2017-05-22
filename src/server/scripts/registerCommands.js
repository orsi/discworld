const Command = require('../commands/Command');
const log = require('../Logger').log;
const Server = require('../Server');
const World = require('../World');

Command.register('compile', null, function () {
    log.print('recompiling scripts...');
    Server.compile();
});
Command.register('showdate', null, function () {
    console.log(new Date().toString());
});
Command.register('world', null, function () {
    var world = World.get();
    if (world) {
        log.print(world.print());
    } else {
        log.print('there is no world currently');
    }
});
Command.register('create', null, function () {
    var world = World.create();
    if (world) {
        log.print('created world');
    } else {
        log.print('err');
    }
});
Command.register('start', null, function () {
    var world = World.get();
    if (world) {
        log.print('starting world');
        world.start();
    } else {
        log.print('there is no world currently');
    }
});
Command.register('stop', null, function () {
    var world = World.get();
    if (world) {
        log.print('stopping world');
        world.stop();
    } else {
        log.print('there is no world currently');
    }
});