import { WorldElement } from './';
import { Entity } from '../../common/models';
import { Point2D } from '../../common/data/point2d';
import { WorldRenderer } from '../world/worldRenderer';

export class EntityComponent extends WorldElement {
    entity: Entity;
    constructor (entity: Entity, renderer: WorldRenderer) {
        super(renderer);
        this.entity = entity;
    }
    connectedCallback() {
        super.connectedCallback();
        let text = document.createTextNode(':)');
        this.shadow.appendChild(text);
        this.style.position = 'absolute';
    }
    render () {
        if (!this.entity.location) return;

        let viewPosition = this.renderer.mapWorldLocationToPixel(this.entity.location.x, this.entity.location.y, this.entity.location.z);
        // let x = viewPosition.x + this.viewport.xOffset + this.viewport.xCenter;
        // let y = viewPosition.y + this.viewport.yOffset + this.viewport.yCenter;
        this.style.left = viewPosition.x + 'px';
        this.style.top = viewPosition.y + 'px';
    }
}
customElements.define('reverie-entity', EntityComponent);