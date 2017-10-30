import * as Components from './component';
export class Entity {
    serial: string;
    components: Components.Component[] = [];
    constructor() {}
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