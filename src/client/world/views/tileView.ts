import { Renderable } from '../../../common/ecs/components/renderable';
import { TileModel } from '../../../common/world/models/tileModel';

export class TileView implements Renderable {
    model: TileModel;
    constructor (model: TileModel) {
        this.model = model;
    }

    draw(ctx: CanvasRenderingContext2D) {}
}