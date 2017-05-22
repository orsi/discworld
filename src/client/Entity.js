const EventManager = require('./EventManager');
var Entity = require('../shared/Entity');
var entity;

module.exports = {
    init: function () {
        events = EventManager.register('world');

        events.on('network:entity', (e) => {
            entity = Entity.clone(e);
        });
    },
    get: function () {
        return entity;
    }
}