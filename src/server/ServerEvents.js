const events = require('events');
const emitter = new events.EventEmitter();

const log = require('./Log').log;

let systems = [];
module.exports = {
  register: function (name) {
    log.debug('"' + name + '" system registered to event channel');
    for (let i = 0; i < systems.length; i++) {
      if (systems[i].name === name) return systems[i];
    }
    let system = new SystemEvent(name);
    systems.push(system);

    log.info(systems);
    
    return system;
  }
}

// current issue:
// event emitter becomes massive after so many worlds are created
// since each world attaches a new event listener, instead of using
// the old one

function SystemEvent (name) {
  this.name = name;
  this.emitter = emitter;
}
SystemEvent.prototype.on = function (eventName, listener) {
  emitter.on(eventName, listener);
}
SystemEvent.prototype.emit = function (eventName, data, cb) {
  log.debug('"' + this.name + '" system emitted event "' + eventName + '"');
  emitter.emit(eventName, data, cb);
}
SystemEvent.prototype.request = function () {}