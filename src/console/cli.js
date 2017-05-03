var readline = require('readline');

module.exports = CLI = {
  init: function () {
    var rl = readline.createInterface(process.stdin, process.stdout);
    rl.setPrompt('reverie cli > ');
    rl.prompt();
    rl.on('line', (line) => {
      switch (line) {
        case 'exit':
          rl.close();
          break;
        case 'time':
          // console.log(world.getTime());
          break;
        case 'info':
          // console.log(world.get());
          break;
        case 'pause':
          console.log('pausing world simulation');
          // pauseWorldSimulation();
          break;
        case 'run':
          console.log('running world simulation');
          // startWorldSimulation()
          break;
        default:
          break;
      }
      rl.prompt();
    }).on('close', function () {
        console.log('quitting Reverie...');
        process.exit(0);
    });
  }
}
