const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// graceful exiting on windows requires listening
// for SIGINT on rl and emitting event to process
if (process.platform === "win32") {
  rl.on('SIGINT', function () {
    process.emit('SIGINT');
  });
}
process.on("SIGINT", function () {
  //graceful shutdown
  closing = true;
  console.log('\n\n...now exiting Reverie');
  process.exit();
});

const ServerEvents = require('./ServerEvents');
const log = require('./Log').log;

let serverConsole;
module.exports = {
    init: function (config) {
        serverConsole = new ServerConsole(config);
        return serverConsole;
    }
};

function ServerConsole (config) {
    this.scripts = [];
    this.closing = false;
    this.serverStartTime = new Date();
    this.lastUpdate = new Date();

    // register system to SystemEvents
    this.events = ServerEvents.register('console');

    // require commands
    this.commands = require('./commands/CommandList');

    // start command line input
    rl.on('line', (line) => {
        var cmd = line.split(' ')[0];
        var args = line.split(' ').slice(1);
        if (this.commands[cmd]) {
            this.commands[cmd].execute(args);
        } else {
            log.print(cmd + ' is not a command');
            log.print(this.commands);
        }
    });
    
    this.loop();
}
ServerConsole.prototype.getUptime = function () {
    return Date.now() - this.serverStartTime;
}
ServerConsole.prototype.loop = function () {
    let now = Date.now();
    let delta = now - this.lastUpdate;
    if (delta >= 1000 * 15) {
        log.print('Server has been up for ' + this.getUptime() / 1000 / 60 + ' minutes');
        this.lastUpdate = now;
    }

    // output to console
    var output = log.output();
    if (output !== '') {
        rl.output.clearLine();
        rl.output.cursorTo(0);
        rl.output.write(output);
        rl.output.write('reverie >> ');
    }

    // loop
    if (!this.closing) setTimeout(() => this.loop(), 1000.0 / 100.0); // ~100 ticks a second
}


