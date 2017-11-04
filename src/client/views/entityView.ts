import { Renderable } from '../../common/ecs/components/renderable';
import * as Components from '../../common/ecs/component';
import { Entity } from '../../common/ecs/entity';

export class EntityView {
    constructor () {}

    draw(ctx: CanvasRenderingContext2D, entity: Entity) {
        let position = entity.getComponent<Components.PositionComponent>('position');
        if (position) {
            ctx.fillStyle = 'red';
            ctx.fillRect(position.x * 13, position.y * 13, 12, 12);
        }
    }
}