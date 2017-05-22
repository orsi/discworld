var log = require('../Logger').log;
var commands = [];

module.exports = {
    register: function (name, args, fn) {
        var cmd = new Command(name, args, fn);
        if (commands[cmd.name] instanceof Command) {
            log.trace('command with the name "' + cmd.name + '" already registered!');
            return;
        }
        commands[cmd.name] = cmd;
    },
    execute: function (name, args) {
        var cmd = commands[name];
        if (cmd instanceof Command) commands[name].execute(args);
        else log.trace('command "' + name + '" doesn\'t exists');
    }
}

function Command (name, args, fn) {
    this.name = name;
    this.args = args;
    this.execute = fn;
}