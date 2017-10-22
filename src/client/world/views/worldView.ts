import { World } from '../world';
import { Renderable } from '../components/renderable';

export class WorldView implements Renderable {
    model: World;
    constructor (model: World) {
        this.model = model;
    }

    draw (delta: number) {}
}