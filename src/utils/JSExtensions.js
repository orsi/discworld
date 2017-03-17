/*
  Object Extensions
*/

// will deep clone an object that has a new reference
Object.prototype.clone = function (obj) {
  let clone = {};
  let value;
  let keys =  Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    value = obj[keys[i]];
    clone[keys[i]] = (value.toString() === '[object Object]') ? new Object().clone(value) : value;
  }
  return clone;
}

// will replace the object's own property with a passed object, if it is defined
Object.prototype.override = function (obj) {
  let keys = Object.keys(this);
  for (let i = 0; i < keys.length; i++) {
    if (typeof obj[keys[i]] !== 'undefined') this[keys[i]] = obj[keys[i]];
  }
  return this;
}

/*
  Array Extensions
*/

// deep clones all properties of an array to a new reference
Array.prototype.clone = function (arr) {
  let clone = [];
  for (let i = 0; i < arr.length; i++) {
    // recursive array function
    let level = arr[i];
    if (Array.isArray(level)) level = new Array().clone(arr[i]);
    if (level.toString() === '[object Object]') level = new Object().clone(arr[i]);

    clone.push(level);
  }
  return clone;
}

// creates a 2-dimensional array, optionally with a value
Array.prototype.create2d = function (width, height, value) {
  let cb;
  if (!value) {
    value = 0;
  } else if (typeof value === 'function') {
    cb = value;
  }
  let array = [];
  for (let x = 0; x < width; x++) {
    array[x] = [];
    for (let y = 0; y < height; y++) {
      if (cb) {
        array[x].push(cb(x, y));
      } else {
        array[x].push(value);
      }
    }
  }
  return array;
}
