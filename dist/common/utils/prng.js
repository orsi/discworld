"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PRNG {
    constructor(seed) {
        this.a = 9301;
        this.b = 49297;
        this.m = 233280;
        this.seed = new Date().getTime();
        if (typeof seed === 'string') {
            const values = [];
            for (let i = 0; i < seed.length; i++) {
                values.push(seed.charCodeAt(i));
            }
            this.seed = parseInt(values.join('') + 0);
        }
        if (typeof seed === 'number') {
            this.seed = seed;
        }
        if (seed === 'undefined')
            console.error(`no seed for prng this: ${this.seed}, given: ${seed}`);
    }
    next() {
        this.seed = (this.seed * this.a + this.b) % this.m;
        return this.seed / this.m;
    }
    range(min, max) {
        return this.next() * (max - min) + min;
    }
}
exports.PRNG = PRNG;
//# sourceMappingURL=prng.js.map