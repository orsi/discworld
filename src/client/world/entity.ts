import { Updateable } from './components/updateable';
import { EntityView } from './views/entityView';
import { EntityModel } from './models/entityModel';

export class Entity implements Updateable {
    view: EntityView;
    model: EntityModel;
    constructor (model: any) {
        this.model = new EntityModel(model);
    }
    update(delta: number) {}
}