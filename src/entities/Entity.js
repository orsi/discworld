var Entity = function () {
  this.name = '';
	this.components = [];
	this.scene = null;

	this.addedToScene = function (newScene) {
		this.scene = newScene;
	}

	this.addComponent = function (component) {
		components.push(component);
		component.addedToGameObject(this);
	}
}

module.exports = Entity;
