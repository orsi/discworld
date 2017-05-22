const SystemEvents = require('./SystemEvents');
let events;

const Logger = require('./Logger');
const log = Logger.log;

const World = require('./World');

const Command = require('./commands/Command');

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

const fs = require('fs');
const path = require('path');

// containers
var world;

module.exports = {
    init: function () {
        // register system to SystemEvents
        events = SystemEvents.register('server');

        // compile scripts in scripts folder
        requireScripts();
        
        // process command line input
        rl.on('line', processLine)

        events.on('network:connection', (socket) => {
            // console.log('client connected to reverie');
        });
        events.on('network:world:create', (socket, data) => {
            world = World.create(data);
        });
        events.on('network:world:generate', (socket, options) => {
            if (world) {
                world.generate(options);
                world.run();
            }
        });

        run();
    },
    compile: requireScripts
}

var scripts = [];
function requireScripts() {
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
            log.debug('compiling script ' + files[i]);
            scripts.push(files[i]);
            require(script);
        } else {
            log.debug('script ' + files[i] + ' already exists. skipping.');
        }
    }
    log.debug('loaded all scripts', scripts);
}
function processLine (line) {
    var cmd = line.split(' ')[0];
    var args = line.split(' ').slice(1);
    Command.execute(cmd, args);
}


var closing = false;
var serverStartDate = new Date();
var currentDate = new Date();
var currentTime = previousTime = currentDate.getTime();

function run () {
    var newDate = new Date();
    var deltaTime = newDate.getTime() - currentTime;
    currentDate = newDate;
    currentTime = newDate.getTime();

    // output to console
    var output = Logger.output();
    if (output !== '') {
        rl.output.clearLine();
        rl.output.cursorTo(0);
        rl.output.write(output);
        rl.output.write('reverie >> ');
    }

    // loop
    if (!closing) setTimeout(run, 1000.0 / 100.0); // ~100 ticks a second
}