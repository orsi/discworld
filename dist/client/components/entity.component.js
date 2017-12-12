"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
class EntityComponent extends _1.WorldElement {
    constructor(entity, renderer) {
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
    render() {
        if (!this.entity.location)
            return;
        let viewPosition = this.renderer.mapWorldLocationToPixel(this.entity.location.x, this.entity.location.y, this.entity.location.z);
        // let x = viewPosition.x + this.viewport.xOffset + this.viewport.xCenter;
        // let y = viewPosition.y + this.viewport.yOffset + this.viewport.yCenter;
        this.style.left = viewPosition.x + 'px';
        this.style.top = viewPosition.y + 'px';
        this.speech.innerText = this.entity.lastSpeech ? this.entity.lastSpeech.text : '';
    }
}
exports.EntityComponent = EntityComponent;
customElements.define('reverie-entity', EntityComponent);
//# sourceMappingURL=entity.component.js.map