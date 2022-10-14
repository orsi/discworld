export default class PRNG {
  private a: number = 9301;
  private b: number = 49297;
  private m: number = 233280;
  private seed: number = new Date().getTime();

  constructor  (seed: string | number) {
    if (typeof seed === 'string') {
        const values: number[] = [];
        for (let i = 0; i < seed.length; i++) {
          values.push(seed.charCodeAt(i));
        }
        this.seed = parseInt(values.join('') + 0);
    }
    if (typeof seed === 'number') {
      this.seed = seed;
    }
    if (seed === 'undefined') console.error(`no seed for prng this: ${this.seed}, given: ${seed}`);
  }

  random () {
    this.seed = (this.seed * this.a + this.b) % this.m;
    return this.seed / this.m;
  }

  range (min: number, max: number) {
    return this.random() * (max - min) + min;
  }
}
