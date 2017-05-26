function Component (component) {
  Component.init.call(this, component);
}
module.exports = Component;

/*
 * Component module static functions
 */

let id = 0;
Component.init = function (component) {
  this._id = ++id;

  // check if component is a string
  if (typeof component === 'string') {
    component = ComponentRegistry[component];
  }

  // no component registered
  if (!component) return;

  // shallow clone component properties
  for (let prop in component) {
    this[prop] = component[prop];
  }
}

// registers a new named component with properties
let ComponentRegistry = {};
Component.register = function (componentName, properties) {
  // check if component name already exists
  if (ComponentRegistry[componentName]) return;

  // attach to registered components
  ComponentRegistry[componentName] = properties;
}
