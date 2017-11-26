import { Entity } from '../../common/models';
import { RendererView } from './rendererView';

export class EntityView {
    constructor () {}

    draw(ctx: CanvasRenderingContext2D, view: RendererView, entity: Entity) {
        let viewPosition = view.mapWorldLocationToPixel(entity.x, entity.y);
        let x = viewPosition.x + view.xOffset + view.xCenter;
        let y = viewPosition.y + view.yOffset + view.yCenter;

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + view.BLOCK_SIZE, y + (view.BLOCK_SIZE / 2));
        ctx.lineTo(x, y + view.BLOCK_SIZE);
        ctx.lineTo(x - view.BLOCK_SIZE, y + (view.BLOCK_SIZE / 2));
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fill();
    }
}