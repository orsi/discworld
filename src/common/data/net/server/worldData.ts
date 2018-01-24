import Packet from '../packet';
import { World } from '../../../models/';

export default class WorldData extends Packet {
    seed: string;
    width: number;
    height: number;
    createdAt: Date;
    temperature: number[][];
    land: boolean[][];
    elevation: number[][];
    hydrology: number[][];
    constructor (model: World) {
        super('world/data');
        this.seed = model.seed;
        this.width = model.width;
        this.height = model.height;
        this.createdAt = model.createdAt;
        this.land = model.land;
        this.elevation = model.elevation;
        this.temperature = model.temperature;
        this.hydrology = model.hydrology;
    }
}