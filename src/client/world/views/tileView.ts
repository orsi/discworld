import { Tile } from '../tile';
import { Renderable } from '../components/renderable';

export class TileView implements Renderable {
    model: Tile;
    constructor (model: Tile) {
        this.model = model;
    }

    draw(ctx: CanvasRenderingContext2D) {}
}