/** Modules */
import * as worldSystem from '../worldSystem';

/** Data */
import { World } from '../../common/models';

export function generateLand (world: World) {
    // let auto = worldSystem.getAutomaton('automaton', world.width, world.height);
    let land: boolean[][] = [];
    let terrainNoise: number[][] = [];
    let xfreq = 6;
    let xwavelength = world.width / xfreq;
    let yfreq = 8;
    let ywavelength = world.height / yfreq;
    let noise = worldSystem.getNoise('elevation');
    for (let x = 0; x < world.width; x++) {
        terrainNoise[x] = [];
        for (let y = 0; y < world.height; y++) {
            terrainNoise[x][y] = noise.noise2d(x / xwavelength, y / ywavelength);
        }
    }
    let minElevation = 0.2;
    for (let x = 0; x < world.width; x++) {
        land[x] = [];
        for (let y = 0; y < world.height; y++) {
            land[x][y] = terrainNoise[x][y] > minElevation;
        }
    }
    world.land = land;
}
export function generateElevation (world: World) {
    if (!world.land) {
        console.log('The world has not generated any land yet to define elevation!');
    }
    let elevation: number[][] = [];
    let xfreq = 6;
    let xwavelength = world.width / xfreq;
    let yfreq = 8;
    let ywavelength = world.height / yfreq;
    let amplitude = worldSystem.MAX_ELEVATION;
    let noise = worldSystem.getNoise('elevation');
    for (let x = 0; x < world.width; x++) {
        elevation[x] = [];
        for (let y = 0; y < world.height; y++) {
            elevation[x][y] = Math.floor(noise.noise2d(x / xwavelength, y / ywavelength) * amplitude);
        }
    }
    world.elevation = elevation;
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