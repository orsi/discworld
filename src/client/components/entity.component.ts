import { WorldElement } from './';
import { BaseEntity } from '../../common/entities/baseEntity';
import { Point2D } from '../../common/data/point2d';
import { WorldRenderer } from '../world/worldRenderer';

export class EntityComponent extends WorldElement {
    entity: BaseEntity;
    avatar: HTMLElement;
    speech: HTMLElement;
    constructor (entity: BaseEntity, renderer: WorldRenderer) {
        super(renderer);
        this.entity = entity;
    }
    connectedCallback() {
        super.connectedCallback();
        this.avatar = document.createElement('div');
        this.avatar.appendChild(document.createTextNode(':)'));
        this.speech = document.createElement('p');
        this.shadow.appendChild(this.avatar);
        this.shadow.appendChild(this.speech);
        this.style.position = 'absolute';
    }
    render () {
        if (!this.entity.location) return;
        if (!this.renderer.isOnScreen(this.entity.location.x, this.entity.location.y, this.entity.location.z)) {
            this.style.display = 'none';
            return;
        }

        let viewPosition = this.renderer.mapToPixel(this.entity.location);
        // let x = viewPosition.x + this.viewport.xOffset + this.viewport.xCenter;
        // let y = viewPosition.y + this.viewport.yOffset + this.viewport.yCenter;
        this.style.left = viewPosition.x + 'px';
        this.style.top = viewPosition.y + 'px';

        this.speech.innerText = this.entity.lastSpeech ? this.entity.lastSpeech.text : '';
    }
}
customElements.define('reverie-entity', EntityComponent);