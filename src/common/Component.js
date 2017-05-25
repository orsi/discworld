let ComponentTypes = require('./ComponentTypes');
module.exports = {
  register: function (componentName, extension) {
    // registers a new named component
    // and can provide an object or function as
    // the component

    // check if component name already exists
    if (ComponentTypes[componentName] !== undefined) {
      return;
    }

    // create component type with component,
    // and an array of entities registered to that
    // component
    ComponentTypes[componentName] = new Component(componentName, extension);
  },
  add: function (componentName, entity) {
    // make sure component is registered first
    if (ComponentTypes[componentName] === undefined) {
      return;
    }

    let component = new Component(componentName, ComponentTypes[componentName]);
    
    // make sure entity doesn't already have component
    if (entity.hasComponent(componentName)) {
      return;
    }

    // add componentName to list of components 
    // entity has
    entity.components.push(componentName);

    // create component on entity
    component.extend(entity);

    // add entity to component entity list
    if (component.entities.indexOf(entity) > -1) {
      return;
    }
    component.entities.push(entity);

    return entity;
  },
  getEntitiesWith: function (componentName) {
    // check if component exists
    if (!ComponentTypes[componentName]) return;
    return ComponentTypes[componentName].entities;
  }
}

let id = 0;
function Component (name, extension) {
  this.id = ++id;
  this.name = name;
  this.extension = extension;
  this.entities = [];
}
Component.prototype.extend = function (entity) {
  if (entity[this.name] !== undefined) return;

  if (typeof this.extension === 'function') {
    entity[this.name] = this.extension;
  } else {
    let obj = {};
    for (let property in this.extension) {
      obj[property] = this.extension[property];
    }
    entity[this.name] = obj;
  }

  this.entities.push(entity);
}
