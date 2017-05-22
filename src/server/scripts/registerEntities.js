const Entity = require('../../shared/Entity');

Entity.register('spirit', [
    'position',
    'render',
    'move',
    'possess'
]);
Entity.register('blob', [
    'position',
    'render',
    'move'
]);

//test
// var spirits = [];
// for (var i = 0; i < 25; i++) {
//     spirits.push(Entity.create('spirit'));
//     console.dir(spirits[i]);
// }