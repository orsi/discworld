var utils = require('../Utilities')

module.exports = {
    create: create
}

function create (world, min, max) {
    var regions = [];

    var x = world.x;
    var y = world.y;
    var z = world.z;

    var center = {
        x: Math.floor(x / 2),
        y: Math.floor(y / 2),
        z: Math.floor(z / 2)
    }
    var radius = center.x; // radius is distance from x0 to xCenter

    for (var i = 0; i < max; i++) {
        var region = {}
        // pick origin point on center z plane
        region.origin = {
            x: Math.round(world.random.range(0, radius)),
            y: Math.round(world.random.range(0, radius)),
            z: center.z
        }

        // create rect of region
        region.width = Math.floor(world.random.range(10, 50));
        region.height = Math.floor(world.random.range(10,50));
        region.bounds = {
            a: {
                x: region.origin.x - Math.floor(region.width / 2),
                y: region.origin.y - Math.floor(region.height / 2)
            },
            b: {
                x: region.origin.x + Math.floor(region.width / 2),
                y: region.origin.y - Math.floor(region.height / 2)
            },
            c: {
                x: region.origin.x + Math.floor(region.width / 2),
                y: region.origin.y + Math.floor(region.height / 2)
            },
            d: {
                x: region.origin.x - Math.floor(region.width / 2),
                y: region.origin.y + Math.floor(region.height / 2)
            }
        }

        // create a cell map for each
        region.cellmap = utils.automaton.create(region.width, region.height);
        // console.dir(region.cellmap);
        regions.push(region);
    }


    // console.dir(regions);

    return regions;
}