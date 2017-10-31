import { Updateable } from '../../common/ecs/components/updateable';
import { EntityModel } from '../../common/ecs/models/entityModel';
import { EntityView } from '../views/entityView';

export class Entity implements Updateable {
    view: EntityView;
    model: EntityModel;
    constructor (model: any) {
        this.model = new EntityModel(model);
    }
    update(delta: number) {}
}