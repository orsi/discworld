var Events = require('events');
var emitter = new Events.EventEmitter();

module.exports = EventChannel = {
  on: function (name, listener) {
    emitter.on(name, listener);
    console.log('on: ', arguments[0])
  },
  emit: function () {
    emitter.emit.apply(emitter, arguments);
      console.log('emitted: ', arguments[0])
  }
}
