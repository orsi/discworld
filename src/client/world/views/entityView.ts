import { Entity } from '../entity';
import { Renderable } from '../components/renderable';

export class EntityView implements Renderable {
    model: Entity;
    constructor (model: Entity) {
        this.model = model;
    }

    draw(ctx: CanvasRenderingContext2D) {}
}