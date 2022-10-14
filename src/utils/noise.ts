import PRNG from './prng';

export default class Noise {
  prng: PRNG;
  samples: { [key: string]: number } = {};
  constructor (seed: string) {
    this.prng = new PRNG(seed);
  }
  noise1d (x: number) {
    let previousPoint = Math.floor(x);
    let nextPoint = Math.ceil(x);
    let previousPointValue = this.get1dValue(previousPoint);
    let nextPointValue = this.get1dValue(nextPoint);
    let distance = x - previousPoint;
    return this.cosInterp(previousPointValue, nextPointValue, distance);
  }
  get1dValue (x: number) {
    let value = this.samples[x];
    // cache value if not available
    if (!value) value = this.samples[x] = this.prng.random();
    return value;
  }
  noise2d(x: number, y: number) {
    let x0 = Math.floor(x);
    let x1 = x0 + 1;
    let y0 = Math.floor(y);
    let y1 = y0 + 1;

    // weight of interpolation along axis
    let xWeight = x - x0;
    let yWeight = y - y0;

    // the four grid point values bounding x, y
    let a = this.get2dValue(x0, y0);
    let b = this.get2dValue(x1, y0);
    let c = this.get2dValue(x0, y1);
    let d = this.get2dValue(x1, y1);

    // how much does each corner influence the value
    let c1 = this.cosInterp(a, b, xWeight);
    let c2 = this.cosInterp(c, d, xWeight);
    let ix0 = this.lerp(c1, c2, yWeight);
    let c3 = this.cosInterp(a, c, yWeight);
    let c4 = this.cosInterp(b, d, yWeight);
    let ix1 = this.lerp(c3, c4, xWeight);

    let value = (ix0 + ix1) / 2;
    return value;
  }
  lerp (x0: number, x1: number, w: number) {
    return (1 - w) * x0 + w * x1;
  }
  cosInterp (v1: number, v2: number, mu: number) {
    const mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
    return (v1 * (1 - mu2)) + (v2 * mu2);
  }
  get2dValue (x: number, y: number) {
    let seed = 'x' + x + 'y' + y;
    let value = this.samples[seed];
    // cache value if not available
    if (!value) value = this.samples[seed] = this.prng.random();
    // console.log(`seed: ${seed} value: ${value}`);
    return value;
  }
}