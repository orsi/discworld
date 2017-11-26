import { PRNG } from './';

export class Noise {
  frequency: number;
  amplitude: number;
  persistence: number;
  octaves: number;
  samples1d: number[] = [];
  samples2d: number[][] = [];
  constructor(frequency: number, amplitude: number, octaves?: number, persistence?: number) {
    this.frequency = frequency;
    this.amplitude = amplitude;
    this.octaves = octaves ? octaves : 1;
    this.persistence = persistence ? persistence : 1;
  }
  noise1d (x: number) {
    let point = x / this.frequency;
    let previousPoint = Math.floor(point);
    let nextPoint = Math.ceil(point);
    let previousPointValue = this.get1dValue(previousPoint);
    let nextPointValue = this.get1dValue(nextPoint);
    let distance = point - previousPoint;
    let result = previousPointValue * (1 - distance) + nextPointValue * (distance);
    return result;
  }
  get1dValue (x: number) {
    let value = this.samples1d[x];
    // cache value if not available
    if (!value) {
      let prng = new PRNG(x);
      value = prng.range(0, this.amplitude);
      this.samples1d[x] = value;
    }
    return value;
  }
  noise2d(x: number, y: number) {
    let xLocation = x / this.frequency;
    let yLocation = y / this.frequency;

    let xLeftLocation = Math.floor(xLocation);
    let xRightLocation = Math.ceil(xLocation);
    let yTopLocation = Math.floor(yLocation);
    let yBottomLocation = Math.ceil(yLocation);

    let topLeftValue = this.get2dValue(xLeftLocation, yTopLocation);
    let topRightValue = this.get2dValue(xRightLocation, yTopLocation);
    let bottomLeftValue = this.get2dValue(xLeftLocation, yBottomLocation);
    let bottomRightValue = this.get2dValue(xRightLocation, yBottomLocation);

    let xDistance = xLocation - xLeftLocation;
    let yDistance = yLocation - yTopLocation;

    // how much does each corner influence the value
    let topLeftInfluence = topLeftValue * ((1 - xDistance) * (1 - yDistance));
    let topRightInfluence = topRightValue * ((xDistance) * (1 - yDistance));
    let bottomLeftInfluence = bottomLeftValue * ((1 - xDistance) * (yDistance));
    let bottomRightInfluence = bottomRightValue * ((xDistance) * (yDistance));

    let result = topLeftInfluence + topRightInfluence + bottomLeftInfluence + bottomRightInfluence;
    return result;
  }
  get2dValue (x: number, y: number) {
    let xAxis = this.samples2d[x];
    if (!xAxis) this.samples2d[x] = [];
    let value = this.samples2d[x][y];

    // cache value if not available
    if (!value) {
      let xRandom = new PRNG(x);
      let xValue = xRandom.range(0, this.amplitude);
      let yRandom = new PRNG(y);
      let yValue = yRandom.range(0, this.amplitude);
      value = (xValue + yValue) / 2;
      this.samples2d[x][y] = value;
    }
    return value;
  }
  fade (f: number) {
    return f * f * f * (f * (f * 6 - 15) + 10);
  }
}