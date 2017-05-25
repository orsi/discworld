const Component = require('./Component');
let EntityTypes = require('./EntityTypes');

let id = 0;
module.exports = Entity;
function Entity (e) {
  this.id = ++id;

  if (typeof e === 'object') {
    // recreate entity
    this.type = e.type;
    attachComponents(this);

    for (let c in this.components) {
      this[c] = e[c];
    }
  } else {
    this.type = e || 'spirit';
    attachComponents(this);
  }
}
Entity.prototype.hasComponent = function (componentName) {
  return this[componentName] !== undefined;
}
Entity.prototype.getComponent = function (componentName) {
  return this[componentName];
}
Entity.prototype.addComponent = function (componentName) {
  Component.add(componentName, this);
}
Entity.prototype.removeComponent = function (componentName) {
  delete this[componentName];
}

function attachComponents(e) {
  if (EntityTypes[e.type]) {
    e.components = EntityTypes[e.type];
    e.components.forEach((componentName) => {
      e.addComponent(componentName);
    });
  }
}
