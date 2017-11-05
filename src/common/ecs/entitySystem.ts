import { Entity } from './entity';
import * as Components from './component';
import { uuid } from '../../common/utils/uuid';

export class EntitySystem {
    private entities: Entity[] = [];
    create(entity?: Entity): Entity {
        let newEntity: Entity;
        if (entity) {
            newEntity = new Entity(entity);
        } else {
            newEntity = new Entity();
        }
        this.entities.push(newEntity);
        return newEntity;
    }
    destroy(entitySerial: string) {
        for (let i = 0; i < this.entities.length; i++) {
            let entity = this.entities[i];
            if (entity.serial === entitySerial) {
                this.entities.splice(i, 1);
            }
        }
    }
    getEntitiesByComponentType(componentType: string): Entity[] {
        return this.entities.filter(entity => {
            for (let component of entity.components) {
                if (component.type === componentType) return true;
            }
            return false;
        });
    }
    getEntityBySerial(serial: string): Entity | void {
        for (let i = 0; i < this.entities.length; i++) {
            let entity = this.entities[i];
            if (entity.serial === serial) return entity;
        }
    }
    getEntityComponent<T extends Components.Component> (componentType: string, entity: Entity): T | undefined {
        for (let component of entity.components) {
            if (component.type === componentType) return component as T;
        }
    }
    getAllEntities() { return this.entities; }
    updateEntity (entitySerial: string, entity: Entity) {
        let oldEntity = this.getEntityBySerial(entitySerial);
        if (oldEntity) {
            oldEntity.components = entity.components;
        }
    }
}