import { WorldModule } from '../worldModule';
import { Entity } from '../../common/models';
import { uuid } from '../../common/utils/uuid';
import { BaseEntity } from '../../common/entities/baseEntity';

export class EntityManager {
    private entities: { [key: string]: BaseEntity } = {};
    world: WorldModule;
    time = 0;
    constructor (world: WorldModule) {
        this.world = world;
    }
    update (delta: number) {
        this.time += delta;
        for (let serial in this.entities) {
            this.entities[serial].update(delta);
        }
    }
    create () {
        let newEntity = new BaseEntity(new Entity());
        newEntity.serial = uuid();
        this.entities[newEntity.serial] = newEntity;
        return newEntity;
    }
    remove (serial: string) {
        return delete this.entities[serial];
    }
    get (serial: string) {
        return this.entities[serial];
    }
    getAll() { return this.entities; }
    find (cb: (entity: BaseEntity) => boolean) {
        let entities = [];
        for (let serial in this.entities) {
            let e = this.entities[serial];
            if (cb(e)) entities.push(e);
        }
        return entities;
    }
}