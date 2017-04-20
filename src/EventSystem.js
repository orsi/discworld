// require standard library
var Events = require('events');

// require reverie systems
// var World = require('./World');
// var Input = require('./Input');
// var Sockets = require('./Sockets');

var Message = function (to, from, type, data) {
    // Properties
    this.to = to;        // a reference to the entity that will receive this message
    this.from = from;    // a reference to the entity that sent this message
    this.type = type;    // the type of this message
    this.data = data;    // the content/data of this message
};

var messages = [];  // list of messages to be dispatched
var emitter = new events.EventEmitter();
module.exports = EventSystem = {
  // Pub/Sub Events
  publish: function (type, data) {
    emitter.emit(type, data);
  },
  subscribe: function (type, callback) {
    emitter.on(type, callback);
  },

  // Message Queue
  message: function (to, from, type, data) {
    messages.push(new Message(to, from, type, data));
  },
  dispatch: function () {
    var i, entity, msg;

    for(i = 0; messages.length; i++) {
        msg = messages[i];
        if(msg) {
            entity = msg.to;
            if(entity) {
                entity.onMessage(msg);
            }
            
            this.messages.splice(i, 1);
            i--;
        }
    }
  },
}
