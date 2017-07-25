const Entity = require('../../common/entities/Entity');
const Component = require('../../common/components/Component');

/*
 *  Spirit Entity
 */

Entity.register('spirit', [
    'position',
    'transform',
    'move'
]);