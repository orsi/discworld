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

    console.log(systems);
    
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
  if (eventType === 'world') console.log('world received from ' + this.name, data, cb);
  emitter.emit(this.name + ':' + eventType, data, cb);
}