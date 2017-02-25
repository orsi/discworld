var socket = io.connect();

var cli = document.querySelector('.cli');
cli.addEventListener('keypress', onKeyPress);
function onKeyPress (e) {
  if (e.key === 'Enter') {
    var input = cli.value;
    console.log(input);
    var li = document.createElement('li');
    var text = document.createTextNode(input);
    li.appendChild(text);

    var chat = document.querySelector('.chat');
    chat.appendChild(li);

    // send
    socket.emit('message', input);

    cli.value = '';
  }
}

socket.on('messages', loadMessages);
function loadMessages (messages) {
  for (msg of messages) {
    var li = document.createElement('li');
    var text = document.createTextNode(msg.value);
    li.appendChild(text);

    var chat = document.querySelector('.chat');
    chat.appendChild(li);
  }
}
socket.on('newMessage', newMessage);
function newMessage (message) {
  var li = document.createElement('li');
  var text = document.createTextNode(message.value);
  li.appendChild(text);

  var chat = document.querySelector('.chat');
  chat.appendChild(li);
}
