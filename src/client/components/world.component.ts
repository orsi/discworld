import { Component, WorldElement, EntityComponent, LocationComponent } from './';
import { World, WorldLocation } from '../../common/models';
import { WorldModule } from '../worldModule';
import { Tile } from '../../common/data/tiles';
import { BaseEntity } from '../../common/entities/baseEntity';
import { WorldRenderer } from '../world/worldRenderer';

export class WorldComponent extends WorldElement {
    canvas: HTMLCanvasElement;
    bufferCanvas: HTMLCanvasElement;
    controller: WorldModule;
    renderer: WorldRenderer;
    locationContainer: HTMLElement;
    entityContainer: HTMLElement;
    locations: { [key: string]: WorldLocation } = {};
    entities: { [key: string]: BaseEntity } = {};
    components: WorldElement[] = [];
    constructor (worldModule: WorldModule, renderer: WorldRenderer) {
        super(renderer);
        this.controller = worldModule;
    }
    connectedCallback () {
        super.connectedCallback();
        // setup width/height
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.style.display = 'block';

        // setup containers
        this.locationContainer = document.createElement('div');
        this.locationContainer.style.zIndex = '0';
        this.shadow.appendChild(this.locationContainer);
        this.entityContainer = document.createElement('div');
        this.entityContainer.style.zIndex = '1';
        this.shadow.appendChild(this.entityContainer);
        // render viewport setup
        this.resize(window.innerWidth, window.innerHeight);
        this.registerEvents();
    }
    getLocationComponent (serial: string) {
        for (let l of this.components) {
            if (l.serial === serial) return l;
        }
    }
    addLocationComponent (location: WorldLocation) {
        if (this.locations[location.serial]) return;

        this.locations[location.serial] = location;
        let lComponent = new LocationComponent(location, this.renderer);
        this.components.push(lComponent);
        this.locationContainer.appendChild(lComponent);
        return lComponent;
    }
    addEntityComponent (entity: BaseEntity) {
        let eComponent;
        // check if component for entity already exists
        for (let c of this.components) {
            if (c.serial === entity.serial) eComponent = <EntityComponent>c;
        }

        // create component
        if (!eComponent) {
            this.entities[entity.serial] = entity;
            eComponent = new EntityComponent(entity, this.renderer);
            this.components.push(eComponent);
            this.entityContainer.appendChild(eComponent);
        }
        return eComponent;
    }
    removeEntityComponent (serial: string) {
        for (let c of this.components) {
            if ((<EntityComponent>c).entity.serial === serial) c.remove();
        }
    }
    didIt = false;
    render () {
        if (!this.controller.world) return;
        // render all components
        this.components.forEach(c => c.render());
    }
    registerEvents () {
        this.addEventListener('mousedown', (e) => {
            if (e.button === 2) this.controller.onMoveStart(e);
        });
        this.addEventListener('mouseup', (e) => {
            if (e.button === 2) this.controller.onMoveEnd(e);
        });
        this.addEventListener('mousemove', (e) => {
            this.controller.onMouseMove(e);
        });
    }
    resize (width: number, height: number) {
        super.resize(width, height);
        this.renderer.setSize(this.width, this.height);
    }
}
customElements.define('reverie-world', WorldComponent);