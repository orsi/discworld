import * as worldSystem from './worldSystem';
import { BIOMES } from '../data/static/biomes';
import World from '../models/world';

/**
 * Generates the disc shape of the world.
 * @param world
 */
export function generateLand (world: World) {
    // figure out the significant portions of the world's disc
    const circleArc = 2 * Math.PI;
    const worldRadius = world.width / 2;
    const centerX = world.width / 2;
    const centerY = world.height / 2;

    // values for slicing disc
    const octaves = 5;
    const chunks = 16;
    const amplitude = worldRadius / 2;
    let landNoise = worldSystem.getNoise('land');
    for (let x = 0; x < world.width; x++) {
        for (let y = 0; y < world.height; y++) {
            // calculate the angle from 12'oclock
            let arc = Math.atan2(y - centerY, x - centerX);
            if (arc < 0) arc = arc + 2 * Math.PI;

            // setup for noise octaves
            let interp = 0;
            let maxAmp = 0;
            let octaveChunks = chunks;
            let octaveAmp = amplitude;
            for (let i = 0; i < octaves; i++) {
                let arcPosition = arc / (circleArc / octaveChunks);
                let previousPoint = Math.floor(arcPosition);
                let nextPoint = Math.ceil(arcPosition);
                let previousPointValue = landNoise.get1dValue(previousPoint % octaveChunks);
                let nextPointValue = landNoise.get1dValue(nextPoint % octaveChunks);
                let arcWeight = arcPosition - previousPoint;
                interp += landNoise.cosInterp(previousPointValue, nextPointValue, arcWeight) * octaveAmp;

                // recalculate values for next octave
                maxAmp += octaveAmp;
                octaveChunks *= 2;
                octaveAmp *= .5;
            }
            // normalize values to original amplitude
            interp = (interp / maxAmp) * amplitude;

            // if this point's distance from center is within
            // the circumference with noise influence, then
            // there is land
            const maxLandDistance = worldRadius - interp;
            const locationDistance = Math.sqrt(Math.pow((x - centerX), 2) + Math.pow((y - centerY), 2));
            world.map[x][y].land = locationDistance < maxLandDistance;
        }
    }
}
export function generateElevation (world: World) {
    // setup for noise octaves
    let octaves = 5;
    let frequency = 6;
    let amplitude = worldSystem.MAX_ELEVATION;
    let elNoise = worldSystem.getNoise('elevation');
    for (let x = 0; x < world.width; x++) {
        for (let y = 0; y < world.height; y++) {
            if (!world.map[x][y].land) {
                world.map[x][y].elevation = 0;
                continue;
            }

            let maxAmp = 0;
            let octaveFrequency = frequency;
            let octaveAmp = amplitude;
            world.map[x][y].elevation = 0;
            for (let i = 0; i < octaves; i++) {
                let wavelength = world.width / octaveFrequency;
                world.map[x][y].elevation += elNoise.noise2d(
                    x * (1 / wavelength),
                    y * (1 / wavelength)
                ) * octaveAmp;
                maxAmp += octaveAmp;
                octaveFrequency *= 2;
                octaveAmp *= .5;
            }
            world.map[x][y].elevation = world.map[x][y].z = (world.map[x][y].elevation / maxAmp) * amplitude;
        }
    }
}

export function generateTemperature (world: World) {
    // general areas of temperature gradient
    const worldRadius = world.width / 2;
    const worldMedianRadius = worldRadius / 2;
    const worldMaxElevation = worldSystem.MAX_ELEVATION;
    const worldMedianElevation = worldMaxElevation / 2;
    const worldCenterX = world.width / 2;
    const worldCenterY = world.height / 2;
    const coldDistance = worldRadius * .6;
    const coldElevation = 160;

    // setup octave noise for temperature gradient octaves
    const octaves = 5;
    let temperatureNoise = worldSystem.getNoise('temperature');
    for (let x = 0; x < world.width; x++) {
        for (let y = 0; y < world.height; y++) {
            if (!world.map[x][y].land) {
                world.map[x][y].temperature = 0;
                continue;
            }

            let landDistanceFromCenter = Math.sqrt(Math.pow(x - worldCenterX, 2) + Math.pow(y - worldCenterY, 2));
            let variance = 0;
            let maxAmp = 0;
            let octaveFrequency = 4;
            let octaveAmp = 1;
            for (let i = 0; i < octaves; i++) {
                let wavelength = worldRadius / octaveFrequency;
                variance += temperatureNoise.noise2d(
                    x * (1 / wavelength),
                    y * (1 / wavelength)
                ) * octaveAmp;
                maxAmp += octaveAmp;
                octaveFrequency *= 2;
                octaveAmp *= .5;
            }
            variance = variance / maxAmp;

            // variance for elevation - higher, colder : lower, hotter
            variance *= 2 - (world.map[x][y].elevation / worldMedianElevation);
            // cold mountain caps
            if (world.map[x][y].elevation > coldElevation) {
                let coldElevationLength = worldMaxElevation - coldElevation;
                let elevationTravelled = world.map[x][y].elevation - coldElevation;
                let scale = elevationTravelled / coldElevationLength;
                variance *= 1 - (scale * 1.5);
            }

            // values are colder away from center, hotter towards it
            variance *= 2 - (landDistanceFromCenter / worldMedianRadius);
            // cold outer edges
            if (landDistanceFromCenter > coldDistance) {
                let coldRegionLength = worldRadius - coldDistance;
                let distanceIn = landDistanceFromCenter - coldDistance;
                let scale = distanceIn / coldRegionLength;
                variance *= 1 - scale;
            }

            let temp = variance * worldSystem.MAX_ELEVATION;

            // cap temperatures at max and min
            if (temp > worldSystem.MAX_ELEVATION) temp = 256;
            if (temp < 0) temp = 0;

            world.map[x][y].temperature = temp;
        }
    }
}
export function generatePrecipitation (world: World) {
    // noise setup
    let octaves = 5;
    let frequency = 4;
    let amplitude = 256;
    let hydroNoise = worldSystem.getNoise('hydrology');
    for (let x = 0; x < world.width; x++) {
        for (let y = 0; y < world.height; y++) {
            if (!world.map[x][y].land) continue;

            let maxAmp = 0;
            let octaveFrequency = frequency;
            let octaveAmp = amplitude;
            world.map[x][y].precipitation = 0;
            for (let i = 0; i < octaves; i++) {
                let wavelength = world.width / octaveFrequency;
                world.map[x][y].precipitation += hydroNoise.noise2d(
                    x * (1 / wavelength),
                    y * (1 / wavelength)
                ) * octaveAmp;
                maxAmp += octaveAmp;
                octaveFrequency *= 2;
                octaveAmp *= .5;
            }
            world.map[x][y].precipitation = (world.map[x][y].precipitation / maxAmp) * amplitude;
        }
    }
}

export function generateBiomes (world: World) {
    for (let x = 0; x < world.width; x++) {
        for (let y = 0; y < world.height; y++) {
            if (!world.map[x][y].land) {
                world.map[x][y].biome = BIOMES.VOID;
                continue;
            }

            let location = world.map[x][y];
            if (location.elevation > 192) {
                world.map[x][y].biome = BIOMES.MOUNTAINS;
            } else if (location.elevation > 128) {
                world.map[x][y].biome = BIOMES.HILLS;
            }  else if (location.elevation > 64 && location.precipitation > 192) {
                world.map[x][y].biome = BIOMES.MIRE;
            } else if (location.elevation > 64 && location.precipitation > 160) {
                world.map[x][y].biome = BIOMES.FOREST;
            } else if (location.elevation > 64 && location.precipitation > 128) {
                world.map[x][y].biome = BIOMES.GRASSLAND;
            } else if (location.elevation > 64 && location.precipitation > 96) {
                world.map[x][y].biome = BIOMES.HEATHLAND;
            } else if (location.elevation > 64 && location.precipitation > 64) {
                world.map[x][y].biome = BIOMES.SAVANNA;
            } else if (location.elevation > 64 && location.precipitation > 0 && location.temperature > 128) {
                world.map[x][y].biome = BIOMES.DESERT;
            } else if (location.elevation > 64 && location.precipitation > 0) {
                world.map[x][y].biome = BIOMES.TUNDRA;
            } else if (location.elevation > 32) {
                world.map[x][y].biome = BIOMES.RIVER;
            } else if (location.elevation > 16) {
                world.map[x][y].biome = BIOMES.LAKE;
            } else if (location.elevation > 0) {
                world.map[x][y].biome = BIOMES.SEA;
            } else {
                world.map[x][y].biome = BIOMES.VOID;
            }
        }
    }
}