import { Renderable } from '../../../common/ecs/components/renderable';
import { EntityModel } from '../../../common/ecs/models/entityModel';

export class EntityView implements Renderable {
    model: EntityModel;
    constructor (model: EntityModel) {
        this.model = model;
    }

    draw(ctx: CanvasRenderingContext2D) {
        // let position = this.model.getComponent<Components.PositionComponent>('position');
    }
}