import * as EventChannel from './eventChannel';
import Module from './module';
import * as readline from 'readline';

/**
 * Terminal process for Reverie
 */
export default class Terminal extends Module {
    public SIGINT = false;
    public commands: { [index: string]: Command } = {};
    public serverStartTime = new Date();
    public lastUpdate = new Date();
    public rl: readline.ReadLine;
    constructor() {
        super('terminal');

        const rl = this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });


        // Setup graceful shutdown
        if (process.platform === 'win32') {
            // if windows, force SIGINT event

            rl.on('close', () => {
                console.log('Win32 close event issued');
                process.emit('SIGINT');
            });
        }

        process.on('SIGINT', () => {
            this.SIGINT = true;
            console.log('\nExiting Reverie\n');
            process.exit();
        });

        // start command line input
        const prefix = 'reverie: ';
        rl.setPrompt(prefix);
        rl.prompt();
        rl.on('line', (line: string) => {
            const args = line.trim().split(' ');
            const cmd = args.shift();
            if (cmd && this.commands[cmd]) {
                this.commands[cmd].execute(args);
            } else {
                console.log(cmd + ' is not a command!');
                console.log('commands: ', this.commands);
            }
            rl.prompt();
        });
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