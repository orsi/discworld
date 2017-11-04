import { Entity } from './entity';

export class EntityEvent {
    constructor (public entity: Entity) {}
}
export class Create extends EntityEvent {
    constructor (entity: Entity) {
        super(entity);
    }
}
export class Update extends EntityEvent {
    constructor (entity: Entity) {
        super(entity);
    }
}
export class Destroyed extends EntityEvent {
    constructor (entity: Entity) {
        super(entity);
    }
}