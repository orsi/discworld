import { PRNG } from './';

export class Noise {
  samples: { [key: string]: number } = {};
  noise1d (x: number) {
    let previousPoint = Math.floor(x);
    let nextPoint = Math.ceil(x);
    let previousPointValue = this.get1dValue(previousPoint);
    let nextPointValue = this.get1dValue(nextPoint);
    let distance = x - previousPoint;
    let result = previousPointValue * (1 - distance) + nextPointValue * (distance);
    return result;
  }
  get1dValue (x: number) {
    let value = this.samples[x];
    // cache value if not available
    if (!value) {
      let prng = new PRNG(x);
      value = this.samples[x] = prng.next();
    }
    return value;
  }
  noise2d(x: number, y: number) {
    let xLeftLocation = Math.floor(x);
    let xRightLocation = Math.ceil(x);
    let yTopLocation = Math.floor(y);
    let yBottomLocation = Math.ceil(y);

    let topLeftValue = this.get2dValue(xLeftLocation, yTopLocation);
    let topRightValue = this.get2dValue(xRightLocation, yTopLocation);
    let bottomLeftValue = this.get2dValue(xLeftLocation, yBottomLocation);
    let bottomRightValue = this.get2dValue(xRightLocation, yBottomLocation);

    let xDistance = x - xLeftLocation;
    let yDistance = y - yTopLocation;

    // how much does each corner influence the value
    let topLeftInfluence = topLeftValue * ((1 - xDistance) * (1 - yDistance));
    let topRightInfluence = topRightValue * ((xDistance) * (1 - yDistance));
    let bottomLeftInfluence = bottomLeftValue * ((1 - xDistance) * (yDistance));
    let bottomRightInfluence = bottomRightValue * ((xDistance) * (yDistance));

    let result = topLeftInfluence + topRightInfluence + bottomLeftInfluence + bottomRightInfluence;
    return result;
  }
  get2dValue (x: number, y: number) {
    let seed = 'x' + x + 'y' + y;
    let value = this.samples[seed];
    if (!value) {
      // cache value if not available
      let rand = new PRNG(seed);
      value = this.samples[seed] = rand.next();
    }
    // console.log(`seed: ${seed} value: ${value}`);
    return value;
  }
}