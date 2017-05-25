const EventManager = require('./EventManager');
const Entity = require('../common/Entity');

module.exports = Player;
function Player () {  
    this.entity;
    // register events
    this.events = EventManager.register('player');
    this.events.on('player/init', (e) => this.onReceivePlayerEntity(e));
    this.events.on('player/update', (e) => this.onReceivePlayerUpdate(e));
}
Player.prototype.get = function (name) {
  switch (name) {
    case 'entity':
      return this.entity;
    case 'regions':
      break;
  }
}
Player.prototype.onReceivePlayerEntity = function (e) {
    console.log(e);
    this.entity = new Entity(e);
}
Player.prototype.onReceivePlayerUpdate = function (e) {
    for (let prop in e) {
      this.entity[prop] = e[prop];
    }
}