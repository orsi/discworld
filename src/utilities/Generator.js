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

    perlin.seed(1);

    for (var x = 0; x < options.x; x++) {
      earth.push([]);
      for (var y = 0; y < options.y; y++) {
        earth[x].push([]);
        for (var z = 0; z < options.z; z++) {
          earth[x][y].push([]);

          var noise = perlin.noise3d(x / (options.x / slice), y / (options.y / slice), z);
          if (noise - (z / options.z) > 0) { // harder to have earth higher in sky
            earth[x][y][z] = 1;
          }

          // debug
          if (noise > max) max = noise;
          if (noise < min) min = noise;
        }
      }
    }

    console.log('earth range: ', max, min);
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
