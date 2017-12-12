"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const tiles_1 = require("../../common/data/tiles");
class LocationComponent extends _1.WorldElement {
    constructor(location, renderer) {
        super(renderer);
        this.location = location;
    }
    connectedCallback() {
        super.connectedCallback();
        // tiles
        let color = '';
        switch (this.location.tile) {
            case tiles_1.Tile.ROCK:
                color = '150,150,150,.8';
                break;
            case tiles_1.Tile.GRASS:
                color = '0,150,0,.8';
                break;
            case tiles_1.Tile.WATER:
                color = '0,0,150,.8';
                break;
            case tiles_1.Tile.DIRT:
                color = '150,120,0,.8';
                break;
            case tiles_1.Tile.NULL:
                color = '0,0,0,.1';
                break;
        }
        this.style.display = 'inline-block';
        this.style.position = 'absolute';
        this.style.backgroundColor = `rgba(${color})`;
        this.style.width = this.renderer.BLOCK_SIZE + 'px';
        this.style.height = this.renderer.BLOCK_SIZE + 'px';
        // viewport.ctx.fillStyle = `rgba(${color},${ z / 128 })`;
        // viewport.ctx.beginPath();
        // viewport.ctx.moveTo(x, y + topSkew); // top
        // viewport.ctx.lineTo(x + viewport.view.BLOCK_SIZE, y + (viewport.view.BLOCK_SIZE / 2) + rightSkew); // right
        // viewport.ctx.lineTo(x, y + viewport.view.BLOCK_SIZE + bottomSkew); // bottom
        // viewport.ctx.lineTo(x - viewport.view.BLOCK_SIZE, y + (viewport.view.BLOCK_SIZE / 2) + leftSkew); // left
        // viewport.ctx.lineTo(x, y + topSkew); // top
        // viewport.ctx.stroke();
        // viewport.ctx.fill();
    }
    render() {
        let viewPosition = this.renderer.mapWorldLocationToPixel(this.location.x, this.location.y, this.location.z);
        if (!this.renderer.isOnScreen(this.location.x, this.location.y, this.location.z)) {
            this.style.display = 'none';
            return;
        }
        // neighbouring tiles
        // let n =     this.renderer.getMapLocation(this.location.x, this.location.y - 1);
        // let ne =    this.renderer.getMapLocation(this.location.x + 1, this.location.y - 1);
        // let e =     this.renderer.getMapLocation(this.location.x + 1, this.location.y);
        // let se =    this.renderer.getMapLocation(this.location.x + 1, this.location.y + 1);
        // let s =     this.renderer.getMapLocation(this.location.x, this.location.y + 1);
        // let sw =    this.renderer.getMapLocation(this.location.x - 1, this.location.y + 1);
        // let w =     this.renderer.getMapLocation(this.location.x - 1, this.location.y);
        // let nw =    this.renderer.getMapLocation(this.location.x - 1, this.location.y - 1);
        this.style.display = 'inline-block';
        this.style.transform = `translate(${viewPosition.x}px, ${viewPosition.y}px) scale(1.45) rotateX(60deg) rotateY(0deg) rotateZ(-45deg)`;
        this.style.zIndex = this.location.z + '';
    }
}
exports.LocationComponent = LocationComponent;
customElements.define('reverie-location', LocationComponent);
//# sourceMappingURL=location.component.js.map