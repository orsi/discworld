import { Component } from './';
import { Entity } from '../../common/models';
import { Point } from '../../common/data/point';
import { Viewport } from '../viewport';

export class EntityComponent extends Component {
    entity: Entity;
    constructor (entity: Entity) {
        super();
        this.entity = entity;
    }
    connectedCallback() {
        super.connectedCallback();
        let text = document.createTextNode(':)');
        this.shadow.appendChild(text);
        this.style.position = 'absolute';
    }
    render (viewport: Viewport) {
        if (!this.entity.location) return;

        let viewPosition = viewport.mapWorldLocationToPixel(this.entity.location.x, this.entity.location.y, this.entity.location.z);
        let x = viewPosition.x + viewport.xOffset + viewport.xCenter;
        let y = viewPosition.y + viewport.yOffset + viewport.yCenter;
        this.style.left = x + 'px';
        this.style.top = y + 'px';
    }
}
customElements.define('reverie-entity', EntityComponent);