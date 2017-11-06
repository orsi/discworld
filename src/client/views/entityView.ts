import * as Components from '../../common/ecs/component';
import { Entity } from '../../common/ecs/entity';
import { ViewRenderer } from '../output/viewRenderer';

export class EntityView {
    constructor () {}

    draw(ctx: CanvasRenderingContext2D, view: ViewRenderer, model: Entity) {
        let position = model.getComponent<Components.PositionComponent>('position');
        if (position) {
            ctx.fillStyle = 'red';
            let viewPosition = view.mapWorldLocationToPixel(position.x, position.y);
            ctx.fillRect(viewPosition.x + view.xOffset + view.xCenter, viewPosition.y + view.yOffset + view.yCenter, view.BLOCK_SIZE, view.BLOCK_SIZE);
        }
    }
}