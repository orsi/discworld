// remove context menu
$reverie.addEventListener('contextmenu', (e) => { e.preventDefault(); });

// attach world events
// world.addEventListener('mousedown', onMouseEvent);
// world.addEventListener('mouseup', onMouseEvent);
// world.addEventListener('mousemove', onMouseEvent)
function onMouseEvent (e) {
  // console.log(e);
  // gather input
  this.left = (e.buttons === 1) || (e.buttons === 3) ? true : false;
  this.right = (e.buttons === 2) || (e.buttons === 3) ? true: false;
  this.x = e.clientX;
  this.y = e.clientY;

  // send move events
  if (this.right) {
    var movement = {
      x: this.x,
      y: this.y
    }
    socket.emit('actor move', movement, onMovement);
  }
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
document.addEventListener('keypress', onKeyPress);
function onKeyDown (e) {
  // console.log(e.key);
  switch (e.key) {
    case 'Backspace':
      $terminal.value = $terminal.value.substr(0, $terminal.value.length - 1);
      break;
    // submit terminal if enter
    case 'Enter':
      onTerminalSubmit($terminal.value);
      $terminal.value = '';
      break;
  }
}
function onKeyUp() {}
function onKeyPress(e) {
  e.preventDefault();
  // console.log(e);
  switch (e.key) {
    case 'Enter':
      break;
    default:
      $terminal.value += e.key;
      break;
  }
}

// attach receive events from server
socket.on('actor connected', onActorConnected);
function onActorConnected (actor) {
  console.log(actor);
  createActor(actor);
}
socket.on('newMessage', newMessage);
function newMessage (message) {
}

// functions
function createActor(actor) {
  var $actor = document.createElement('actor');
  $actor.style.color = actor.color;
  $actor.style.position = 'absolute';
  $actor.style.top = actor.y;
  $actor.style.left = actor.x;
  $actor.appendChild(document.createTextNode(actor.symbol));
  world.appendChild($actor);
}
function onMovement(response, movement) {
  console.log(response);
  console.log(movement);
  if (response) {
    var actor = document.querySelector('actor');
    actor.style.top = movement.y;
    actor.style.left = movement.x;
  }
}
function onMessage(response, message) {
  console.log(response, message);
  if (response) {
    var $actor = document.querySelector('actor');
    var $speech = document.querySelector('actor > p');
    console.dir($speech);
    if (!$speech) {
      var $speech = document.createElement('p');
      $speech.style.position = 'absolute';
      $speech.style.top = '-100%';
      $speech.style.margin = 0;
      $speech.appendChild(document.createTextNode(''));
      $actor.appendChild($speech);
    }
    $speech.childNodes[0].nodeValue = message.text;
  }
}
function onCreateWorld(response, world) {
  if (response) renderWorld(world);
}


function onTerminalSubmit(input) {
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
        let args = {};
        for (let i = 0; i < parsedInput.length; i++) {
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
              for (let i = 0; i < value.length; i++) {
                value[i] = parseInt(value[i]);
              }
              break;
          }
          args[key] = value;
        }
        
        // send
        socket.emit('world create', args, onCreateWorld);
        break;
      default:
        console.log('unknown command: ', command);
        break;
    }
  } else { // send input to server as message
    console.log('message: ', input);
  }
}
