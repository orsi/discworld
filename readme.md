# Reverie
Reverie is a procedurally generated multi-user world simulation.

## Notes  
### Attempting Singletons in Node.js Modules
#### Class Syntax
Global variable outside of class holds instance. Class will always return the instance variable that is set on the first call to new Singleton(). Any further calls to new Singleton() will return the first instance.

var instance = null;
class Singleton {
  constructor() {
    if (!instance) instance = this;

    this.date = new Date();

    return instance;
  }
}
module.exports = Singleton;

Drawbacks include using a class, when all you want is a single object. Classes are made to be extendible and created repeatedly, which a singleton seems to be the opposite.

### Object syntax
Exports an object, which by nature is a reference to a single object.

var Singleton = {
  date: new Date()
}
module.exports = Singleton;

or more concisely...

module.exports = {
  date: new Date()
}

Drawbacks include no constructor function contained within object. Initialization done on the object can be done in the module file outside of the object, similar to the instance variable in the Class syntax.

## Side Effects
Node.js will cache modules based on the filename, which allows for most singleton patterns to exist. However, typos in the referencing, such as require('./Singleton') and require('./singleton'), will both fetch the same module, except there will always be two instances no matter which method is used.

## Random
### Array.forEach()
Array.forEach() only performs callback when element at index is set. Unfortunately, new Array(5) only sets the array length to 5, and every element is undefined. Therefore, Array.forEach(cb) never gets called!
