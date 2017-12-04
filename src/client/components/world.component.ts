import { Component, WorldElement, EntityComponent, LocationComponent } from './';
import { World, WorldLocation, Entity } from '../../common/models';
import { WorldModule } from '../worldModule';
import { Tile } from '../../common/data/tiles';
import { WorldRenderer } from '../world/worldRenderer';

export class WorldComponent extends WorldElement {
    canvas: HTMLCanvasElement;
    bufferCanvas: HTMLCanvasElement;
    controller: WorldModule;
    renderer: WorldRenderer;
    locations: { [key: string]: WorldLocation } = {};
    entities: { [key: string]: Entity } = {};
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
        // render viewport setup
        this.resize(window.innerWidth, window.innerHeight);
        this.registerEvents();
    }
    addLocationComponent (location: WorldLocation) {
        if (this.locations[location.serial]) return;

        this.locations[location.serial] = location;
        let lComponent = new LocationComponent(location, this.renderer);
        this.components.push(lComponent);
        this.shadow.appendChild(lComponent);
    }
    addEntityComponent (entity: Entity) {
        if (this.entities[entity.serial]) return;

        this.entities[entity.serial] = entity;
        let eComponent = new EntityComponent(entity, this.renderer);
        this.components.push(eComponent);
        this.shadow.appendChild(eComponent);
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