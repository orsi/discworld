var utils = require('../utilities/Utilities');
var perlin = utils.perlin;
var rand = utils.random;
var automaton = utils.automaton;

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
    /* goal 1:  create a 2d automaton grid to get basic outline of
     *          a disc world
     * goal 2:  calculate height values on each live automaton cell
     *          that will determine the surface z-axis above and below
     *          center z-axis
     * goal 3:  create density grid towards lowest z point under each
     *          surface, becoming smaller in radius from the surface
     *          as it lowers
     */

    var earth = [];
    var slice = rand.range(11, 23);
    var max = min = 0;
    var centerX = Math.floor(options.x / 2);
    var centerY = Math.floor(options.y / 2);
    var centerZ = Math.floor(options.z / 2);

    perlin.seed(1);

    // step 1
    var cells = new automaton(options.x, options.y);

    // step 2
    var heightMap = [];
    for (var x = 0; x < options.x; x++) {
      heightMap.push([]);
      for (var y = 0; y < options.y; y++) {
        if (cells.map[x][y]) {
          // normalize -1 to 1 range to -centerZ to +centerZ
          var noise = perlin.noise2d(x / slice, y / slice);
          var range = noise * centerZ;
          heightMap[x][y] = Math.round(range);

          // debug
          // if (x % 10 === 0 && y % 10 === 0) console.log(heightMap[x][y], noise, range);
          if (heightMap[x][y] > max) max = heightMap[x][y];
          if (heightMap[x][y] < min) min = heightMap[x][y];
        }
      }
    }
    console.log('min max: ', min, max);

    // step 3
    var maxDistance = Math.sqrt((centerX*centerX) + (centerY*centerY) + (centerZ*centerZ));
    for (var x = 0; x < options.x; x++) {
      earth.push([]);
      for (var y = 0; y < options.y; y++) {
        earth[x].push([]);
        for (var z = 0; z < options.z; z++) {
          // calculate distance from center and ratio to farthest point
          var dX = Math.abs(x - centerX);
          var dY = Math.abs(y - centerY);
          var dZ = Math.abs(z - centerZ);
          var fromCenter = Math.sqrt((dX*dX) + (dY*dY) + (dZ+dZ));
          var ratio = fromCenter / maxDistance;

          var noise = perlin.noise3d(x / (options.x / slice), y / (options.y / slice), z);
          // convert noise from -1 to 1 to 0 to 1
          noise = noise + 1 * (1/2);

          // make it rare farther, denser closer to the center
          var density = noise * (1 / 2 + (1 - ratio));

          // cap density at 1
          if (density > 1) density = 1;

          if (cells.map[x][y] && z < heightMap[x][y]) {
            earth[x][y][z] = density;
          } else {
            earth[x][y][z] = 0;
          }
        }
      }
    }
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
