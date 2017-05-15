var EventChannel = require('../EventChannel');
var flags = [];
module.exports = Log = {
  set: function (flag) {
    flags[flag] = true;

    if (flags['debug']) {
      EventChannel.on('network:start', onNetworkStart);
      EventChannel.on('socket:connection', onSocketConnection);
    }
  }
}

function onNetworkStart() {
  // console.log('Network was started...');
}

function onSocketConnection(socket) {
  console.log('socket connected: ', socket.id);
}
