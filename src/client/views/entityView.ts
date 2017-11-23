import { Entity } from '../../common/models';
import { RendererView } from './rendererView';

export class EntityView {
    constructor () {}

    draw(ctx: CanvasRenderingContext2D, view: RendererView, entity: Entity) {
        ctx.fillStyle = 'red';
        let viewPosition = view.mapWorldLocationToPixel(entity.x, entity.y);
        ctx.fillRect(viewPosition.x + view.xOffset + view.xCenter, viewPosition.y + view.yOffset + view.yCenter, view.BLOCK_SIZE, view.BLOCK_SIZE);
    }
}