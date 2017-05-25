var events = require('events');
var emitter = new events.EventEmitter();

var systems = [];
module.exports = {
  register: function (name) {
    for (var i = 0; i < systems.length; i++) {
      if (systems[i].name === name) return systems[i];
    }
    var system = new System(name);
    systems.push(system);
    return system;
  }
}

function System (name) {
  this.name = name;
  this.emitter = emitter;
}
System.prototype.on = function (eventType, listener) {
  emitter.on(eventType, listener);
}
System.prototype.emit = function (eventType, data, cb) {
  emitter.emit(eventType, data, cb);
}