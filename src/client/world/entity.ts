import { Updateable } from './components/updateable';
import { EntityView } from './views/entityView';

export class Entity implements Updateable {
    view: EntityView;
    constructor () {}
    update(delta: number) {}
}