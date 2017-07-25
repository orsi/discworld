import * as EventChannel from './eventChannel';
import Module from './module';
import * as readline from 'readline';

/**
 * Terminal process for Reverie
 */
export default class Terminal extends Module {
    public commands: Array<Command>;
    public serverStartTime = new Date();
    public lastUpdate = new Date();
    constructor() {
        super('terminal');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        // start command line input
        // rl.on('line', (line) => {
        //     const cmd = line.split(' ')[0];
        //     const args = line.split(' ').slice(1);
        //     if (this.commands[cmd]) {
        //         this.commands[cmd].execute(args);
        //     } else {
        //         console.log(cmd + ' is not a command');
        //         console.log(this.commands);
        //     }
        // });
    }
    update (delta: number) {
        // output to console
        // const output = log.output();
        // if (output !== '') {
        //     rl.output.clearLine();
        //     rl.output.cursorTo(0);
        //     rl.output.write(output);
        //     rl.output.write('reverie >> ');
        // }
    }
    getUptime () {
        return Date.now() - this.serverStartTime.getTime();
    }
}

interface Command {
    name: string;
    execute: (args?: Array<string>) => void;
}