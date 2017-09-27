import { Entity } from './Entity';
import { Component } from './Component';

export class EntityComponentManger {
    private entities: Entity[];
    add(entity: Entity): void {
        this.entities.push(entity);
    }
    remove(entity: Entity): boolean {
        let index = this.entities.indexOf(entity);

        if (index >= 0) {
            this.entities.splice(index, 1);
            return true;
        }

        return false;
    }
    getEntitiesBy(componentType: string): Entity[] {
        return this.entities.filter(entity => {
            for (let component of entity.components) {
                if (component.type === componentType) return true;
            }
            return false;
        });
    }
    getComponent<T extends Component> (componentType: string, entity: Entity): T | undefined {
        for (let component of entity.components) {
            if (component.type === componentType) return component as T;
        }
    }
}