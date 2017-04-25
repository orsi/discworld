# Reverie
Reverie is a procedurally generated multi-user world simulation.

## Systems
* Server
  * Reverie Server Engine
  * Communication
  * Console
  * Network (Socket.io)
  * World
    * Entities
    * Components
    * Environments
    * Tiles
  * Database
  * Utilities
  * Http Server (Express.io)
* Client
  * Reverie Client Engine
  * Communication
  * World
    * Entities
    * Components
    * Environments
      * Tiles
  * Network (Socket.io)
  * Resources
  * Input
    * Keyboard
      * Terminal
    * Mouse
  * Output
    * Interface
      * Speech
      * Thoughts
      * Interactions
    * Graphics
    * Audio
      * Environment
      * Effects

## Design patterns
#### Singletons  
Node.js modules make Singletons the default for exports when using an object. `module.exports` presents a public API to other modules, with all code outside of it becoming a shared private space for only the module.

```
// Private
var entities = ['Player1', 'Enemy45', 'Item12', 'StrangeHut3'];
function checkStatus (entity) {
  // Do something private
}


// Public
module.exports = {
	region: 'tropical forest',
  coords: {
    x: 567,
    y: 123
  },
	getEntities: function () {
    return entities;
  }
}
```  

*Node.js will cache modules based on the filename, however, typos in require('./Singleton') and require('./singleton') will load two different versions of the same module.*

#### Types  
Constructor function can be used with Node.js modules to build Custom Types. Attaching a function to `module.exports` will allow outside modules to use the `new CustomType()` syntax to create instances. Privacy outside of the `module.exports` is shared amongst all instance, so private instance variables should be declared syntactically in side the constructor function by a preceding underscore.

```
var entities = [];
function getDamageRoll(min, max) {
  // random roll
}

module.exports = Entity
function Entity(id) {
    this.id = id;     // public
    this._hitpoints = 55; // private
}
User.prototype.isHit = function() {
	this._hitpoints = getDamageRoll();
}
```

#### Factories  
Factories are modules which can used to create specific versions of custom types.

```
/* A Factory Implemented as a Custom Type */
var Widget = require('./lib/widget');

var WidgetFactory = module.exports = function WidgetFactory(options) {
	this.cogs = options.cogs;
	this.bool = options.bool;
}

WidgetFactory.prototype.getRedWidget = function getRedWidget() {
	var widget = new Widget(this.cogs, this.bool);
	widget.paintPartA('red');
	widget.paintPartB('red');
	widget.paintPartC('red');
	return widget;
};

WidgetFactory.prototype.getBlueWidget = function getBlueWidget() {
	// ...
};
```
