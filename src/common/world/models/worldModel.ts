export class WorldModel {
    createdAt: Date;
    width: number;
    height: number;
    seed: string;
    map: any;
    constructor (seed: string = 'reverie') {
        this.createdAt = new Date();
        this.seed = seed;
    }
}