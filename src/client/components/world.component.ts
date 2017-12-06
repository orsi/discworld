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
    move: any;
    registerEvents () {
        this.addEventListener('mousedown', (e) => {
            if (e.button === 2) this.controller.socket.emit('move', this.parseMouseDirection(e.x, e.y));
        });
    }
    resize (width: number, height: number) {
        super.resize(width, height);
        this.renderer.setSize(this.width, this.height);
    }
    parseMouseDirection (x: number, y: number) {
        let direction = '';

        if (this.isNorth(x, y)) direction += 'n';
        if (this.isEast(x, y)) direction += 'e';
        if (this.isWest(x, y)) direction += 'w';
        if (this.isSouth(x, y)) direction += 's';
        return direction;
    }
    getTheta (x: number, y: number) {
        // translate around origin
        x = x - this.center.x;
        y = y - this.center.y;
        // get angle
        let rad = Math.atan2(-1, 1) - Math.atan2(x, y);
        rad =  rad * 360 / (2 * Math.PI);
        if (rad < 0) rad += 360;
        return rad;
    }
    isNorth(x: number, y: number) {
        let theta = this.getTheta(x, y);
        return  theta >= 30 && theta <= 175;
    }
    isEast(x: number, y: number) {
        let theta = this.getTheta(x, y);
        return theta >= 110 && theta <= 245;
    }
    isWest(x: number, y: number) {
        let theta = this.getTheta(x, y);
        return theta >= 0 && theta <= 55
            || theta >= 280 && theta <= 360;
    }
    isSouth(x: number, y: number) {
        let theta = this.getTheta(x, y);
        return theta >= 225 && theta <= 315;
    }
}
customElements.define('reverie-world', WorldComponent);