const Component = require('../components/Component');

function Entity (entity) {
  Entity.init.call(this, entity);
}
module.exports = Entity;

Entity.prototype.hasComponent = function (componentName) {
  return this._components[componentName] !== undefined;
}

Entity.prototype.getComponent = function (componentName) {
  return this._components[componentName];
}

Entity.prototype.getComponents = function (componentName) {
  return this._components;
}

Entity.prototype.addComponent = function (component) {
  // create component if string
  if (typeof component === 'string') component = Component.get(component);

  // check if component exists on entity
  if (this._components[component.name]) return;

  // add component to entity
  this._components[component.name] = component;
}

Entity.prototype.removeComponent = function (componentName) {
  delete this._components[componentName];
}


/*
 * Entity module static functions
 */

let id = 0;
Entity.init = function (entity) {
  this._id = ++id;
  this._components = {};

  // see if entity type exists
  if (typeof entity === 'string') {
    entity = EntityRegistry[entity];
  }
  
  if (entity) {
    // recreate entity from object
    this._name = entity._name;
    for (let componentName in entity._components) {
      this._components[componentName] = new Component(entity._components[componentName]);
    };
    this._components['position'].x = 50;
  } else {
    // create a dummy entity
    this._name = 'unknown';
  }
}

// registers an Entity type to create defaults
let EntityRegistry = {};
Entity.register = function (name, components) {
  // check if an Entity is aready registered with that name
  if (EntityRegistry[name]) return;

  // create default template for entity
  let entityType = {
    _name: name,
    _components: {}
  }

  // creating template components with strings will
  // make created entities inherit default component
  // values
  components.forEach((componentName) => {
    entityType._components[componentName] = componentName;
  });
  EntityRegistry[entityType._name] = entityType;
}
