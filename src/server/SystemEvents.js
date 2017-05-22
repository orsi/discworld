var events = require('events');
var log = require('./Logger').log;
var emitter = new events.EventEmitter();

var systems = [];
module.exports = {
  register: function (name) {
    log.debug('"' + name + '" system registered to event channel');
    for (var i = 0; i < systems.length; i++) {
      if (systems[i].name === name) return systems[i];
    }
    var system = new System(name);
    systems.push(system);

    log.info(systems);
    
    return system;
  }
}

// current issue:
// event emitter becomes massive after so many worlds are created
// since each world attaches a new event listener, instead of using
// the old one

function System (name) {
  this.name = name;
  this.emitter = emitter;
}
System.prototype.on = function (eventName, listener) {
  emitter.on(eventName, listener);
}
System.prototype.emit = function (eventName, data, cb) {
  log.debug('"' + this.name + '" system emitted event "' + eventName + '"');
  emitter.emit(eventName, data, cb);
}