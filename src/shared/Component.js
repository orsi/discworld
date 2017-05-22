let components = {};
module.exports = {
  register: function (componentName, component) {
    // registers a new named component
    // and can provide an object or function as
    // the component

    // check if component name already exists
    if (components[componentName] !== undefined) {
      return;
    }

    // create component entry with properties,
    // and an array of entities registered to that
    // component
    components[componentName] = {
      component: component,
      entities: []
    };
  },
  add: function (componentName, entity) {
    // make sure component is registered first
    if (components[componentName] === undefined) {
      return;
    }

    let component = components[componentName];
    
    // make sure entity doesn't already have component
    if (entity.has(componentName)) {
      return;
    }
    // create component on entity
    entity.components[componentName] = new Component(component.component);

    // add entity to component entity list
    if (component.entities.indexOf(entity) > -1) {
      return;
    }
    component.entities.push(entity);

    return entity;
  },
  getEntitiesWith: function (componentName) {
    // check if component exists
    if (!components[componentName]) return;
    return components[componentName].entities;
  }
}

function Component (component) {
  if (typeof component === 'function') {
    return component;
  } else if (typeof component === 'object') {
    var obj = {};
    for (let property in component) {
      obj[property] = component[property];
    }
    return obj;
  }
}