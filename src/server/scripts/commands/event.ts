import { Terminal, Command } from '../../modules/terminal';

new Command (Terminal.instance, 'event', function () {
    console.log('event command');
});
