/** Modules */
import * as worldSystem from '../worldSystem';

/** Data */
import { World } from '../../common/models';
import Point2D from '../../common/data/point2d';

/**
 * Generates the disc shape of the world.
 * @param world
 */
export function generateLand (world: World) {
    let land: boolean[][] = [];
    let centerX = world.width / 2;
    let centerY = world.height / 2;

    // calculate the radius of the circle within the world's width and height
    let worldRadius = world.width / 2;

    // values for slicing disc
    const circleArc = 2 * Math.PI;
    const amplitude = worldRadius / 6;
    const arcSlices = 16;
    const arcChunkSize = circleArc / arcSlices;
    let arcNoise: number[] = [];
    let landNoise = worldSystem.getPseudo('land');
    for (let i = 0; i < arcSlices; i++) {
        arcNoise.push(landNoise.random());
    }

    for (let x = 0; x < world.width; x++) {
        land[x] = [];
        for (let y = 0; y < world.height; y++) {
            // calculate the angle from 12'oclock
            let arc = Math.atan2(y - centerY, x - centerX);
            if (arc < 0) arc = arc + 2 * Math.PI;

            let arcPosition = arc / arcChunkSize;
            let previousPoint = Math.floor(arcPosition);
            let nextPoint = Math.ceil(arcPosition);
            let previousPointValue = arcNoise[previousPoint % arcSlices];
            let nextPointValue = arcNoise[nextPoint % arcSlices];
            let arcWeight = arcPosition - previousPoint;

            const mu2 = (1 - Math.cos(arcWeight * Math.PI)) / 2;
            let interp = (previousPointValue * (1 - mu2)) + (nextPointValue * mu2);

            // if this point's distance from center is within
            // the circumference with noise influence, then
            // there is land
            const maxLandDistance = worldRadius - (interp * amplitude);
            const locationDistance = Math.sqrt(Math.pow((x - centerX), 2) + Math.pow((y - centerY), 2));
            land[x][y] = locationDistance < maxLandDistance;
        }
    }

    world.land = land;
}
export function generateElevation (world: World) {
    // create elevation noise map
    let terrainNoise: number[][] = [];
    let threshold = 0.5;
    let octaves = 5;
    let persistence = .5;
    let lacunarity = 2;
    let elNoise = worldSystem.getNoise('elevation');
    for (let x = 0; x < world.width; x++) {
        terrainNoise[x] = [];
        for (let y = 0; y < world.height; y++) {
            let normalize = 0;
            let frequency = 1 / (world.width / 6);
            let amplitude = worldSystem.MAX_ELEVATION;
            terrainNoise[x][y] = 0;
            for (let i = 0; i < octaves; i++) {
                terrainNoise[x][y] += elNoise.noise2d(
                    x * frequency,
                    y * frequency
                ) * amplitude;
                normalize += amplitude;
                amplitude *= persistence;
                frequency *= lacunarity;
            }
            terrainNoise[x][y] = terrainNoise[x][y] / normalize * worldSystem.MAX_ELEVATION;
        }
    }
    world.elevation = terrainNoise;
}

export function generateTemperature (world: World) {
    if (!world.elevation) {
        console.log('The world has no elevation map to generate temperature on!');
    }
    let temp: number[][] = [];
    let freq = 3;
    let wavelength = world.width / freq;
    let amplitude = worldSystem.MAX_ELEVATION;
    let noise = worldSystem.getNoise('temperature');
    for (let x = 0; x < world.width; x++) {
        temp[x] = [];
        for (let y = 0; y < world.height; y++) {
            temp[x][y] = Math.floor(noise.noise2d(x / wavelength, y / wavelength) * amplitude);
        }
    }
    world.temperature = temp;
}
export function generateHydrology (world: World) {
    if (!world.temperature || !world.elevation) {
        console.log('The world has no temperature or no elevation!');
    }
    let hydro: number[][] = [];
    let wavelength = 8;
    let amplitude = worldSystem.MAX_ELEVATION;
    let noise = worldSystem.getNoise('hydrology');
    for (let x = 0; x < world.width; x++) {
        hydro[x] = [];
        for (let y = 0; y < world.height; y++) {
            hydro[x][y] = Math.floor(noise.noise2d(x / wavelength, y / wavelength) * amplitude);
        }
    }
    world.hydrology = hydro;
}
/**
 * Creates the elements which can be found within each
 * region generated dependent on the land, elevation,
 * temperature, and hydrology fields.
 */
export function generateElements (world: World) {
    // if (!world.temperature || !world.elevation) {
    //     console.log('Cannot create elements with no temperature or elevation!');
    // }
    // let elements: ELEMENTS[] = [];
    // for (let i = 0; i < world.width * world.height; i++) {
    //     let element: ELEMENTS;
    //     let height = world.elevation[i];
    //     let heat = world.temperature[i];
    //     if (height > 120) {
    //         element = ELEMENTS.OXYGEN;
    //     } else if (height > 60) {
    //         element = ELEMENTS.HYDROGEN;
    //     } else if (height > 30) {
    //         element = ELEMENTS.CARBON;
    //     } else if (height > 10) {
    //         element = ELEMENTS.GOLD;
    //     } else {
    //         element = ELEMENTS.IRON;
    //     }
    // }
    // return elements;
}
/**
 * Creates the biomes which depend upon the generated
 * land, elevation, temperature, and hydrology fields.
 */
export function generateRegions (world: World) {
    // if (!world.elevation || !world.hydrology) {
    //     console.log('Cannot create regions when there is no elevation or hydrology!');
    // }
    // let regions: WorldRegion[] = [];
    // for (let i = 0; i < world.width * world.height; i++) {
    //     let regionType: REGIONS;
    //     if (world.elevation[i] > 120) {
    //         regionType = REGIONS.HILLS;
    //     } else if (world.elevation[i] > 80 && world.hydrology[i] < 5) {
    //         regionType = REGIONS.FOREST;
    //     } else if (world.elevation[i] > 40 && world.hydrology[i] < 5) {
    //         regionType = REGIONS.PLAINS;
    //     } else {
    //         regionType = REGIONS.SEA;
    //     }
    //     let newRegion = new WorldRegion(
    //         world.getHash('region-' + i),
    //         regionType,
    //         i % world.width,
    //         Math.floor(i / world.width),
    //         world.elevation[i]
    //     );
    //     regions[i] = newRegion;
    // }
    // return regions;
}
/**
 * Creates the synthesized location of each cell
 * in the created world.
 */
export function generateLocations(world: World) {
    // if (!world.regions || !world.elements) {
    //     console.log('Cannot create locations with no regions or elements!');
    // }
    // let locations: WorldLocation[] = [];
    // for (let i = 0; i < world.width * world.height; i++) {
    //     let locationType: LOCATIONS;
    //     let element = world.elements[i];
    //     if (element === ELEMENTS.CARBON) {
    //         locationType = LOCATIONS.DIRT;
    //     } else {
    //         locationType = LOCATIONS.GRASS;
    //     }
    //     locations[i] = new WorldLocation(
    //         world.getHash('location-' + i),
    //         i % world.width,
    //         Math.floor(i / world.width),
    //         world.elevation[i],
    //         locationType
    //     );
    // }
    // return locations;
}
let midpoints: { [key: string]: number } = {};
function getMidpoints (x: number, y: number, z: number) {
    // check for pre-calculated vertices
    let leftMidpoint = midpoints['x' + x + 'y' + y];
    let topMidpoint = midpoints['x' + (x + 1) + 'y' + y];
    let rightMidpoint = midpoints['x' + (x + 1) + 'y' + (y + 1)];
    let bottomMidpoint = midpoints['x' + x + 'y' + (y + 1)];

    // if (typeof leftMidpoint === 'undefined') {
    //     leftMidpoint = z;
    //     let leftCount = 1;
    //     let n = elevation[x * (y - 1)];
    //     let w = x - 1 >= 0 ? elevation[(x - 1) * y] : undefined;
    //     let nw = x - 1 >= 0 ? elevation[(x - 1) * (y - 1)] : undefined;
    //     if (n) {
    //         leftMidpoint += n;
    //         leftCount++;
    //     }
    //     if (w) {
    //         leftMidpoint += w;
    //         leftCount++;
    //     }
    //     if (nw) {
    //         leftMidpoint += nw;
    //         leftCount++;
    //     }
    //     midpoints['x' + x + 'y' + y] = leftMidpoint /= leftCount;
    // }
    // if (typeof topMidpoint === 'undefined') {
    //     topMidpoint = z;
    //     let topCount = 1;
    //     let n = elevation[x * (y - 1)];
    //     let ne = x + 1 < world.height ? elevation[(x + 1) * (y - 1)] : undefined;
    //     let e = x + 1 < world.height ? elevation[(x + 1) * y] : undefined;
    //     if (n) {
    //         topMidpoint += n;
    //         topCount++;
    //     }
    //     if (ne) {
    //         topMidpoint += ne;
    //         topCount++;
    //     }
    //     if (e) {
    //         topMidpoint += e;
    //         topCount++;
    //     }
    //     midpoints['x' + (x + 1) + 'y' + y] = topMidpoint /= topCount;
    // }
    // if (typeof rightMidpoint === 'undefined') {
    //     rightMidpoint = z;
    //     let rightCount = 1;
    //     let e = x + 1 < world.width ? elevation[(x + 1) * y] : undefined;
    //     let se = x + 1 < world.width ? elevation[(x + 1) * (y + 1)] : undefined;
    //     let s = elevation[x * (y + 1)];
    //     if (e) {
    //         rightMidpoint += e;
    //         rightCount++;
    //     }
    //     if (se) {
    //         rightMidpoint += se;
    //         rightCount++;
    //     }
    //     if (s) {
    //         rightMidpoint += s;
    //         rightCount++;
    //     }
    //     midpoints['x' + (x + 1) + 'y' + (y + 1)] = rightMidpoint /= rightCount;
    // }
    // if (typeof bottomMidpoint === 'undefined') {
    //     bottomMidpoint = z;
    //     let bottomCount = 1;
    //     let s = elevation[x * (y + 1)];
    //     let sw = x - 1 >= 0 ? elevation[(x - 1) * (y + 1)] : undefined;
    //     let w = x - 1 >= 0 ? elevation[(x - 1) * y] : undefined;
    //     if (s) {
    //         bottomMidpoint += s;
    //         bottomCount++;
    //     }
    //     if (sw) {
    //         bottomMidpoint += sw;
    //         bottomCount++;
    //     }
    //     if (w) {
    //         bottomMidpoint += w;
    //         bottomCount++;
    //     }
    //     midpoints['x' + x + 'y' + (y + 1)] = bottomMidpoint /= bottomCount;
    // }
    return {
        left: leftMidpoint - z,
        top: topMidpoint - z,
        right: rightMidpoint - z,
        bottom: bottomMidpoint - z
    };
}