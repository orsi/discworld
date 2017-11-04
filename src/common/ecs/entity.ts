import * as Components from './component';
import { uuid } from '../../common/utils/uuid';
export class Entity {
    serial: string;
    components: Components.Component[] = [];
    constructor(entity?: Entity) {
        if (entity) {
            this.serial = entity.serial;
            if (entity.components) {
                entity.components.forEach(component => {
                    this.components.push(component);
                });
            }
        } else {
            this.serial = uuid();
        }
    }
    getComponent <T extends Components.Component> (componentName: string): T | void {
        for (let i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            if (component.type === componentName) return <T>component;
        }
    }
    addComponent <T extends Components.Component> (componentName: string): T | void {
        let component;
        switch (componentName) {
            case 'position':
                component = new Components.PositionComponent();
                break;
        }
        if (component) this.components.push(component);
        return <T | void> component;
    }
}