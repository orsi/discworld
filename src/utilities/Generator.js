var utils = require('./Utilities');
var perlin = utils.perlin;
var rand = utils.random;

module.exports = {
  generate: function (generatorName, options) {
    switch (generatorName) {
      case 'earth':
        return generateEarth(options);
        break;
      case 'wind':
        return generateWind(options);
       break;
      case 'water':
        return generateWater(options);
        break;
      case 'fire':
        return generateFire(options);
        break;
    }
  }
}

function generateEarth(options) {
    var earth = [];
    var slice = Math.pow(3, (1 / options.regions));
    var max = min = 0;
    var centerX = options.x / 2;
    var centerY = options.y / 2;
    var centerZ = options.z / 2;

    // farthest point length IS centerX/Y/Z
    var farthestPoint = Math.sqrt((centerX*centerX) + (centerY*centerY) + (centerZ*centerZ));

    perlin.seed(1);

    for (var x = 0; x < options.x; x++) {
      earth.push([]);
      for (var y = 0; y < options.y; y++) {
        earth[x].push([]);
        for (var z = 0; z < options.z; z++) {
          earth[x][y].push([]);

          /* goal 1: have positions closer to the border of the 3d grid
           * have a less likely chance to become earth, i.e., allow more
           * sky around the entire world, with a solid core
           *
           * goal 2: make positions closer to the center have higher values
           * in order to simulate the core becoming 'denser'
           */

          // calculate distance from center and ratio to farthest point
          var dX = Math.abs(x - centerX);
          var dY = Math.abs(y - centerY);
          var dZ = Math.abs(z - centerZ);
          var fromCenter = Math.sqrt((dX*dX) + (dY*dY) + (dZ+dZ));
          var ratio = fromCenter / farthestPoint;

          var noise = perlin.noise3d(x / (options.x / slice), y / (options.y / slice), z);
          // convert noise from -1 to 1 to 0 to 1
          noise = noise + 1 * (1/2);

          // make it more likely to be land closer to center
          var isEarth = noise > ratio;

          // make it rare farther, denser closer to the center
          var density = noise * (1 / 2 + (1 - ratio));

          // cap density at 1
          if (density > 1) density = 1;

          // if isEarth is false, set default to zero
          earth[x][y][z] = isEarth ? density : 0;

          // debug
          // if (ratio > 0.997 || ratio < 0.005) console.log(ratio, noise, earth[x][y][z]);
          if (earth[x][y][z] > max) max = earth[x][y][z];
          if (earth[x][y][z] < min) min = earth[x][y][z];
        }
      }
    }

    console.log('min max: ', min, max);
    return earth;
}
function generateWind(options) {
  var wind = [];
  var slice = Math.pow(3, (1 / options.regions));
  var max = min = 0;

  perlin.seed(2);

  for (var x = 0; x < options.x; x++) {
    wind.push([]);
    for (var y = 0; y < options.y; y++) {
      wind[x].push([]);
      for (var z = 0; z < options.z; z++) {
        wind[x][y].push([]);

        var noise = perlin.noise3d(x / (options.x / slice), y / (options.y / slice), z);
        if (noise > 0) {
          wind[x][y][z] = 1;
        }

        // debug
        if (noise > max) max = noise;
        if (noise < min) min = noise;
      }
    }
  }

  console.log('wind range: ', max, min);
  return wind;
}
function generateWater(options) {
  var water = [];
  var slice = Math.pow(3, (1 / options.regions));
  var max = min = 0;

  perlin.seed(3);

  for (var x = 0; x < options.x; x++) {
    water.push([]);
    for (var y = 0; y < options.y; y++) {
      water[x].push([]);
      for (var z = 0; z < options.z; z++) {
        water[x][y].push([]);

        var noise = perlin.noise3d(x / (options.x / slice), y / (options.y / slice), z);
        if (noise > 0) {
          water[x][y][z] = 1;
        }

        // debug
        if (noise > max) max = noise;
        if (noise < min) min = noise;
      }
    }
  }

  console.log('water range: ', max, min);
  return water;
}
function generateFire(options) {
  var fire = [];
  var slice = Math.pow(3, (1 / options.regions));
  var max = min = 0;

  perlin.seed(4);

  for (var x = 0; x < options.x; x++) {
    fire.push([]);
    for (var y = 0; y < options.y; y++) {
      fire[x].push([]);
      for (var z = 0; z < options.z; z++) {
        fire[x][y].push([]);

        var noise = perlin.noise3d(x / (options.x / slice), y / (options.y / slice), z);
        if (noise > 0) {
          fire[x][y][z] = 1;
        }

        // debug
        if (noise > max) max = noise;
        if (noise < min) min = noise;
      }
    }
  }

  console.log('fire range: ', max, min);
  return fire;
}
