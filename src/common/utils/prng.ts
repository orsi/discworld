export default class PRNG {
  private a: number = 9301;
  private b: number = 49297;
  private m: number = 233280;
  private seed: number;

  constructor  (seed: string | number) {
    if (!seed) this.seed = new Date().getTime();
    if (typeof seed === 'string') {
      const values = [];
      for (let i = 0; i < seed.length; i++) {
        values.push(seed.charCodeAt(i));
      }
      this.seed = parseInt(values.join('') + 0);
    }
  }

  next () {
    this.seed = (this.seed * this.a + this.b) % this.m;
    return this.seed / this.m;
  }

  range (min: number, max: number) {
    return (this.next() * (max - min)) + min;
  }
}
