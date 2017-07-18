import * as readline from 'readline';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let closing = false;
process.on("SIGINT", function () {
  //graceful shutdown
  closing = true;
  console.log('\n\n...now exiting Reverie');
  process.exit();
});

// graceful exiting on windows requires listening
// for SIGINT on rl and emitting event to process
if (process.platform === "win32") {
  rl.on('SIGINT', function () {
    process.emit('SIGINT');
  });
}

// const ServerEvents = require('./ServerEvents');
// const log = require('./Log').log;

// let serverConsole;
// module.exports = {
//     init: function (config) {
//         serverConsole = new ServerConsole(config);
//         return serverConsole;
//     }
// };

let scripts = [];
let serverStartTime = new Date();
let lastUpdate = new Date();

// register system to SystemEvents
// this.events = ServerEvents.register('console');

// require commands
let commands = require('./commands/CommandList');

// start command line input
rl.on('line', (line) => {
    var cmd = line.split(' ')[0];
    var args = line.split(' ').slice(1);
    if (commands[cmd]) {
        commands[cmd].execute(args);
    } else {
        console.log(cmd + ' is not a command');
        console.log(commands);
    }
});

loop();

export function getUptime () {
    return new Date().getTime() - serverStartTime.getTime();
}
function loop () {
    let now = new Date();
    let delta = now.getTime() - lastUpdate.getTime();
    if (delta >= 1000 * 15) {
        console.log('Server has been up for ' + getUptime() / 1000 / 60 + ' minutes');
        lastUpdate = now;
    }

    // output to console
    // var output = log.output();
    // if (output !== '') {
    //     rl.output.clearLine();
    //     rl.output.cursorTo(0);
    //     rl.output.write(output);
    //     rl.output.write('reverie >> ');
    // }

    // loop
    if (!closing) setTimeout(() => loop(), 1000.0 / 100.0); // ~100 ticks a second
}