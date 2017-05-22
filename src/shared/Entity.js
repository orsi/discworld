var Component = require('../shared/Component');

let types = {};
let entities = [];
module.exports = {
  register: function (entityName, components) {
    // registers a new type of entity
    // with an array of components to add
    // to it when created

    if (types[entityName] !== undefined) {
      // already registered
      return;
    }

    types[entityName] = components;
  },
  create: function (type) {
    // check if entity type exists
    let components = types[type];
    if (!components) return;
    
    // creates a new entity of the type
    // and adds all of its components
    let entity = new Entity(type);

    components.forEach(function (componentName) {
      entity.add(componentName);
    });

    // add to entities list
    entities.push(entity);
    
    return entity;
  },
  remove: function (entity) {
    for (var i = 0; i < entities.length; i++) {
      if (entity === entities[i]) {
        entities.splice(i, 1);
        break;
      }
    }
  },
  clone: function (e) {
    // recreate entity from data
    let entity = new Entity(e.type);
    entity.id = e.id;
    
    // add each component to entity
    for (let component in e.components) {
      entity.components[component] = e.components[component];
    }
    
    return entity;
  }
}

var id = 0;
function Entity (type) {
  this.type = type;
  this.id = ++id;
	this.components = {};
}
Entity.prototype.has = function (componentName) {
  return this.components[componentName] !== undefined;
}
Entity.prototype.get = function (componentName) {
  return this.components[componentName];
}
Entity.prototype.add = function (componentName) {
  Component.add(componentName, this);
}
Entity.prototype.remove = function (componentName) {
  delete this.components[componentName];
}
