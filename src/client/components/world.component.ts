import { Component, EntityComponent, LocationComponent } from './';
import { World, WorldLocation, Entity } from '../../common/models';
import { WorldModule } from '../worldModule';
import { Tile } from '../../common/data/tiles';
import { Viewport } from '../viewport';

export class WorldComponent extends Component {
    canvas: HTMLCanvasElement;
    bufferCanvas: HTMLCanvasElement;
    controller: WorldModule;
    components: Component[] = [];
    constructor (worldModule: WorldModule) {
        super();

        this.controller = worldModule;
    }
    connectedCallback () {
        super.connectedCallback();
        // setup width/height
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.style.display = 'block';
        this.resize(window.innerWidth, window.innerHeight);
    }
    addLocationComponent (location: WorldLocation) {
        let lComponent = new LocationComponent(location);
        this.components.push(lComponent);
        this.shadow.appendChild(lComponent);
    }
    addEntityComponent (entity: Entity) {
        let eComponent = new EntityComponent(entity);
        this.components.push(eComponent);
        this.shadow.appendChild(eComponent);
    }
    render (viewport: Viewport) {
        if (!this.controller.world) return;
        let clientEntity = this.controller.getAgentEntity();
        if (!clientEntity) return;
        let origin = viewport.mapWorldLocationToPixel(clientEntity.entity.location.x, clientEntity.entity.location.y, clientEntity.entity.location.z);
        viewport.setOrigin(origin.x, origin.y);

        this.components.forEach(c => c.render(viewport));
    }
    update () {
          //   // do event parse
          //   if (iEvent.element.name === 'world') {
          //     if (iEvent.event.type === 'mousedown') {
          //         let e = <MouseEvent>iEvent.event;
          //         // world click
          //         if (e.button === 2) this.move = this.parseMouseDirection(e.x, e.y);
          //     }
          // }
          // if (iEvent.event.type === 'mouseup') {
          //     let e = <MouseEvent>iEvent.event;
          //     // world click
          //     if (e.button === 2) this.move = undefined;
          // }
          // if (iEvent.event.type === 'mousemove') {
          //     let e = <MouseEvent>iEvent.event;
          //     // if moving
          //     if (this.move) this.move = this.parseMouseDirection(e.x, e.y);
          // }
    }
    resize (width: number, height: number) {
        super.resize(width, height);
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