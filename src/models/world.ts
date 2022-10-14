import WorldLocation from './worldLocation';
export default class World {
    seed: string;
    width: number;
    height: number;
    createdAt: Date;
    map: WorldLocation[][];
    constructor () {}
}