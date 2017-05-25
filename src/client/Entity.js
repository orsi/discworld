const BaseEntity = require('../common/Entity');
const EventManager = require('./EventManager');
let events;

var entity;
module.exports = {
    init: function () {
        events = EventManager.register('entity');
        entity = new EntityClient();
    },
    get: function () {
        return entity;
    }
}

function EntityClient () {
    BaseEntity.Base.call(this);

    // register events
    events.on('entity/init', (e) => this.onEntityInit(e));
    events.on('entity/update', (e) => this.onEntityUpdate(e));
}
EntityClient.prototype = Object.create(BaseEntity.Base.prototype);
EntityClient.prototype.onEntityUpdate = function (e) {
    BaseEntity.clone(this, e);
}
EntityClient.prototype.onEntityInit = function (e) {
    BaseEntity.clone(this, e);
    console.log(e);
}
