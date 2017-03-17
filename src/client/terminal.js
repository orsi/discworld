// imports
var Canvas = require('./canvas'),
    Sockets = require('./sockets');

var terminal;
module.exports = Terminal = function (t) {
  terminal = t;

  return this;
}
Terminal.focus = function () {
  terminal.focus();
}
var historyIndex = -1;
var terminalHistory = [];
Terminal.prevHistory = function () {
  historyIndex++;
  if (historyIndex > terminalHistory.length - 1) historyIndex = terminalHistory.length - 1;
}
Terminal.nextHistory = function () {
  historyIndex--;
  if (historyIndex < -1) historyIndex = -1;
  if (historyIndex === -1) {
    terminal.value = '';
  } else {
    terminal.value = terminalHistory[historyIndex];
  }

  // set caret at the end of line
  // strange hack for chrome
  setTimeout(function () { terminal.value = terminal.value; }, 0);
}
Terminal.submit = function () {
  input = terminal.value;
  // save input to terminal history if it's the same as last
  console.log(terminalHistory, historyIndex);
  if (terminalHistory[historyIndex] !== input) {
    terminalHistory.unshift(input);
  }
  historyIndex = -1;

  // parse input to see if it is a command or a simple message
  var parsedInput = input.split(' ');
  var isCommand = parsedInput[0].startsWith('/');

  // if it is a command, find out which command it is, and then see if there are arguments
  if (isCommand) {
    var command = parsedInput.shift().substring(1); // remove forward slash
    // send commands to server
    switch (command) {
      case 'create':
        // create command takes a series of arguments
        var args = {};
        for (var i = 0; i < parsedInput.length; i++) {
          var argument = parsedInput[i].split('=');
          var key = argument[0];
          var value = argument[1];
          switch (key) {
            case 'x':
            case 'y':
            case 'steps':
              value = parseInt(value);
              break;
            case 'alivePercent':
              value = parseFloat(value);
              break;
            case 'birth':
            case 'survival':
              value = value.split(',');
              for (var j = 0; j < value.length; j++) {
                value[j] = parseInt(value[j]);
              }
              break;
            default:
              break;
          }
          args[key] = value;
        }

        // send
        Sockets.sendWorldCreateCommand();
        break;
      case 'step':
        // send
        Sockets.sendWorldStepCommand();
        break;
      default:
        console.log('unknown command: ', command);
        break;
    }
  } else { // send input to server as message
    console.log('message: ', input);
  }

  terminal.value = '';
}
