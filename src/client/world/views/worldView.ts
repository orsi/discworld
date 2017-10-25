import { Renderable } from '../components/renderable';
import { WorldModel } from '../models/worldModel';

export class WorldView implements Renderable {
    model: WorldModel;
    constructor (model: WorldModel) {
        this.model = model;
    }

    draw (delta: number) {}
}