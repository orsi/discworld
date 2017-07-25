import Component from './Component';
export default abstract class Entity {
    public name: string;
    public components: Array<Component> = [];
    constructor () {}

    hasComponent (componentName: string) {
        return this.getComponent(componentName) !== undefined;
    }

    getComponent (componentName: string) {
        this.components.forEach((component: Component) => {
            if (component.name === componentName) return component;
        });
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