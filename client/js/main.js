const socket = io.connect();
const world = document.querySelector('#world');
const terminal = document.querySelector('#terminal');

// remove context menu
world.addEventListener('contextmenu', (e) => { e.preventDefault(); });

// attach world events
world.addEventListener('mousedown', onMouseEvent);
world.addEventListener('mouseup', onMouseEvent);
world.addEventListener('mousemove', onMouseEvent)
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

document.addEventListener('keydown', onKeyEvent);
function onKeyEvent (e) {
  // console.log(e.key);
  switch (e.key) {
    case 'Backspace':
      terminal.value = terminal.value.substr(0, terminal.value.length - 1);
      break;
    // submit terminal if enter
    case 'Enter':
      // var input = terminal.value;
      // console.log(input);
      // var li = document.createElement('li');
      // var text = document.createTextNode(input);
      // li.appendChild(text);
      //
      // var chat = document.querySelector('.chat');
      // chat.appendChild(li);
      //
      // send
      socket.emit('actor message', terminal.value, onMessage);
      terminal.value = '';
      break;
    default:
      terminal.value += e.key;
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
