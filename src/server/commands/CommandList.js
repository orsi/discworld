const ServerEvents = require('../ServerEvents');
let events = ServerEvents.register('command');
let commandList = [];

/* 
 * Command Object Template
 * */
function Command (name, fn) {
    if (commandList[name]) {
        return;
    }

    this.name = name;
    this.fn = fn;

    // add command to commands array
    commandList[this.name] = this;
}
Command.prototype.execute = function (args) {
    return this.fn(args);
}

// Compile scripts in the ./scripts folder
const fs = require('fs');
const path = require('path');
new Command('compile', function () {
    // make sure compiled scripts are empty first
    // to avoid recompiling not happening
    scripts.splice(0, scripts.length);

    var dir = path.resolve(__dirname, 'scripts/');
    var files = fs.readdirSync(dir);
    for (var i = 0; i < files.length; i++) {
        var script = path.resolve(dir, files[i]);

        // remove cached require in case of recompiling
        // #todo circular references still happen when recompiling
        delete require.cache[require.resolve(script)];

        if (scripts.indexOf(files[i]) === -1) {
            console.log('compiling script ' + files[i]);
            scripts.push(files[i]);
            require(script);
        } else {
            console.log('script ' + files[i] + ' already exists. skipping.');
        }
    }
    console.log('loaded all scripts', scripts);
});

// Print world to console
new Command('world', function () {
    events.request('world/get/info', (world) => {
        if (world) {
            console.log(world.print());
        } else {
            console.log('there is no world currently');
        }
    });
});
// create a new world
new Command('create', function () {
    events.emit('reverie/world/create');
});
// Start running updates on current world
new Command('start', function () {
    events.emit('world/start');
});
// Stop running updates on current world
new Command('stop', function () {
    event.emit('world/stop');
});
module.exports = commandList;