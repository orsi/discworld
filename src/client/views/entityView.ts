import { Entity } from '../../common/models';
import { RendererView } from './rendererView';
import { Point } from '../../common/data/point';

export class EntityView {
    constructor () {}

    draw(ctx: CanvasRenderingContext2D, view: RendererView, entity: Entity) {
        if (!entity.location) return;
        let viewPosition = view.mapWorldLocationToPixel(entity.location.x, entity.location.y, entity.location.z);
        let x = viewPosition.x + view.xOffset + view.xCenter;
        let y = viewPosition.y + view.yOffset + view.yCenter;

        let center = new Point(0, view.BLOCK_SIZE / 2);

        ctx.fillStyle = 'rgba(255,0,255,.3)';
        ctx.beginPath();
        ctx.arc(x + center.x, y + center.y, view.BLOCK_SIZE / 4, 0, 2 * Math.PI);
        ctx.fill();
    }
}