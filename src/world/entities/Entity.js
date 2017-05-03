module.exports = Entity;

function Entity () {
  this.id = ++Entity._id;
  Entity._count++;

	this.components = {};
  return this;
}

Entity._id = 0;
Entity._count = 0;

Entity.prototype.addComponent = function (component) {
  this.components[component.name] = component;
  return this;
}

Entity.prototype.removeComponent = function (componentName) {
  delete this.components[componentName];
  return this;
}

Entity.prototype.print = function () {
    console.log(JSON.stringify(this, null, 4));
    return this;
};
