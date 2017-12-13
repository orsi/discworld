import { WorldElement } from './';
import { BaseEntity } from '../../common/entities/baseEntity';
import { Point2D } from '../../common/data/point2d';
import { WorldRenderer } from '../world/worldRenderer';

export class EntityComponent extends WorldElement {
    height: number = 32;
    width: number = 32;
    entity: BaseEntity;
    speechElements: { [spechSerial: string]: HTMLElement} = {};
    avatarElement: HTMLElement;
    speechElement: HTMLElement;
    constructor (entity: BaseEntity, renderer: WorldRenderer) {
        super(renderer);
        this.entity = entity;
    }
    connectedCallback() {
        super.connectedCallback();
        this.speechElement = document.createElement('div');
        this.speechElement.style.position = 'absolute';
        this.speechElement.style.bottom = '100%';
        this.speechElement.style.left = '50%';
        this.speechElement.style.transform = 'translateX(-50%)';
        this.speechElement.style.width = '240px';
        this.speechElement.style.textAlign = 'center';
        this.avatarElement = document.createElement('div');
        this.avatarElement.style.textAlign = 'center';
        this.avatarElement.appendChild(document.createTextNode('😀'));
        this.shadow.appendChild(this.speechElement);
        this.shadow.appendChild(this.avatarElement);
        this.style.position = 'absolute';
        this.style.width = this.width + 'px';
        this.style.height = this.height + 'px';
    }
    render () {
        if (!this.entity.location) return;
        if (!this.renderer.isOnScreen(this.entity.currentLocation.x, this.entity.currentLocation.y, this.entity.currentLocation.z)) {
            this.style.display = 'none';
            return;
        }

        let viewPosition = this.renderer.mapToPixel(this.entity.currentLocation);
        // let x = viewPosition.x + this.viewport.xOffset + this.viewport.xCenter;
        // let y = viewPosition.y + this.viewport.yOffset + this.viewport.yCenter;
        this.style.left = (viewPosition.x - (this.width / 2)) + 'px';
        this.style.top = (viewPosition.y - (this.height / 2)) + 'px';

        // add new speech if they don't exist
        for (let i = 0; i < this.entity.currentSpeech.length; i++) {
            let speech = this.entity.currentSpeech[i];
            // see if component exists
            if (!this.speechElements[speech.serial]) {
                let newSpeechComponent = this.speechElements[speech.serial] =  document.createElement('p');
                let speechInlineBlock = document.createElement('div');
                speechInlineBlock.style.display = 'inline-block';
                speechInlineBlock.style.wordBreak = 'break-word';
                speechInlineBlock.style.textAlign = 'left';
                let text = document.createTextNode(speech.text);
                speechInlineBlock.appendChild(text);
                newSpeechComponent.appendChild(speechInlineBlock);
                this.speechElement.appendChild(newSpeechComponent);
            }
        }
        // remove expired components
        for (let serial in this.speechElements) {
            if (!this.entity.currentSpeech.some(s => s.serial === serial)) {
                this.speechElements[serial].remove();
                delete this.speechElements[serial];
            }
        }
    }
}
customElements.define('reverie-entity', EntityComponent);