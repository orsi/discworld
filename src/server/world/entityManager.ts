import { EntityType, Entity } from '../../common/models';
import { uuid } from '../../common/utils/uuid';
import { SocketEntity } from './entities/socketEntity';
import { BaseEntity } from '../../common/entities/baseEntity';
import { WorldModule } from '../worldModule';

export class EntityManager {
    private entityTypes: EntityType[] = [];
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
        let newEntity = new BaseEntity();
        this.entities[newEntity.entity.serial] = newEntity;
        return newEntity;
    }
    createSocketEntity (socket: SocketIO.Socket) {
        let newEntity = new SocketEntity(socket, this.world);
        this.entities[newEntity.entity.serial] = newEntity;
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