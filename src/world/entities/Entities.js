var Entity = require('./Entity');
var Components = require('../components/Components');

module.exports = {
  create: function () {
    var entity = new Entity();
    entity.addComponent(Components.add('position'));
    entity.addComponent(new Components.Render());
    entity.addComponent(new Components.Script());
    return entity;
  },
  createPlayer: function () {
    var entity = new Entity();

    entity.addComponent(new Components.Bounds());
    entity.addComponent(new Components.Health());
    entity.addComponent(Components.add('position'));
    entity.addComponent(new Components.Move());
    entity.addComponent(new Components.Interact());
    entity.addComponent(new Components.Render());
    entity.addComponent(new Components.Talk());
    entity.addComponent(new Components.Script());

    console.dir(entity);

    return entity;
  }
}
