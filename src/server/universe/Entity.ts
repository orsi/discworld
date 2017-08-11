import Component from './Component';
export default class Entity {
    public id: number;
    public name: string;
    public components: Array<Component> = [];
    constructor (name: string) {
    }

    hasComponent (componentName: string) {
        return this.getComponent(componentName) !== undefined;
    }

    getComponent (componentName: string) {
        for (let component of this.components) {
            if (component.name === componentName) return component;
        }
    }

    getComponents () {
        return this.components;
    }

    addComponent (component: Component) {
        // check if component exists on entity
        if (this.hasComponent(component.name)) return;

        // add component to entity
        this.components.push(component);
    }
    removeComponent (componentName: string) {
        this.components.forEach((component: Component, i) => {
            if (component.name === componentName) this.components.splice(i, 1);
        });
    }
}