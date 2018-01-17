import Packet from '../packet';
import { World } from '../../../models/';

export default class WorldData extends Packet {
    seed: string;
    width: number;
    height: number;
    createdAt: Date;
    land: boolean[];
    temperature: number[];
    elevation: number[];
    hydrology: number[];
    constructor (model: World) {
        super('world/data');
        this.seed = model.seed;
        this.width = model.width;
        this.height = model.height;
        this.createdAt = model.createdAt;
        this.land = model.land;
        this.temperature = model.temperature;
        this.elevation = model.elevation;
        this.hydrology = model.hydrology;
    }
}