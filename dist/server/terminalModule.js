"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base Command class for creating terminal commands.
 */
class Command {
    constructor(terminal, commandName, execute) {
        this.terminal = terminal;
        this.commandName = commandName;
        this.execute = execute;
        terminal.addCommand(this);
    }
}
exports.Command = Command;
class TerminalModule {
    constructor(reverie, options) {
        this.commands = {};
        this.serverStartTime = new Date();
        this.inputBuffer = [];
        if (process.stdin.isTTY) {
            process.stdin.setEncoding('utf8');
            process.stdin.on('data', (chunk) => {
                console.log(chunk);
                this.parseInput(chunk);
            });
        }
        // start terminal
        console.log('terminal started...');
        TerminalModule.instance = this;
    }
    update() {
        // this.resetScreen();
        // this.printScreen();
        // this.readInput();
    }
    resetScreen() {
        console.clear();
    }
    parseInput(chunk) {
        // sanitize chunk
        chunk = chunk.replace('\r', '');
        let params = chunk.split(' ');
        let command = params.shift();
        if (command && this.commands[command]) {
            this.commands[command].execute.apply(this, params);
        }
        else {
            console.log('There is no "' + command + '" command.');
            console.log('Available commands:');
            for (let commandName in this.commands) {
                console.log('    ' + commandName);
            }
        }
    }
    addCommand(command) {
        this.commands[command.commandName] = command;
    }
    getUptime() {
        return Date.now() - this.serverStartTime.getTime();
    }
}
exports.TerminalModule = TerminalModule;
//# sourceMappingURL=terminalModule.js.map