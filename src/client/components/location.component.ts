import { WorldElement } from './';
import { WorldLocation } from '../../common/models';
import { Point2D } from '../../common/data/point2d';
import { Tile } from '../../common/data/tiles';
import { WorldRenderer } from '../world/worldRenderer';

export class LocationComponent extends WorldElement {
    location: WorldLocation;
    constructor (location: WorldLocation, renderer: WorldRenderer) {
        super(renderer);
        this.location = location;
    }
    connectedCallback () {
        super.connectedCallback();
        // tiles
        let color = '';
        switch (this.location.tile) {
            case Tile.ROCK:
                color = '150,150,150,.8';
                break;
            case Tile.GRASS:
                color = '0,150,0,.8';
                break;
            case Tile.WATER:
                color = '0,0,150,.8';
                break;
            case Tile.DIRT:
                color = '150,120,0,.8';
                break;
            case Tile.NULL:
                color = '0,0,0,.1';
                break;
        }

        this.style.display = 'inline-block';
        this.style.position = 'absolute';
        this.style.border = '1px solid black';
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
    render () {
        let viewPosition = this.renderer.mapToPixel(this.location);
        if (!this.renderer.isOnScreen(this.location.x, this.location.y, this.location.z)) {
            this.style.display = 'none';
            return;
        }
        this.style.display = 'inline-block';

        // neighbouring tiles
        // let n =     this.renderer.getMapLocation(this.location.x, this.location.y - 1);
        // let ne =    this.renderer.getMapLocation(this.location.x + 1, this.location.y - 1);
        // let e =     this.renderer.getMapLocation(this.location.x + 1, this.location.y);
        // let se =    this.renderer.getMapLocation(this.location.x + 1, this.location.y + 1);
        // let s =     this.renderer.getMapLocation(this.location.x, this.location.y + 1);
        // let sw =    this.renderer.getMapLocation(this.location.x - 1, this.location.y + 1);
        // let w =     this.renderer.getMapLocation(this.location.x - 1, this.location.y);
        // let nw =    this.renderer.getMapLocation(this.location.x - 1, this.location.y - 1);

        this.style.transform = `translate(${viewPosition.x}px, ${viewPosition.y}px)`;
        // this.style.zIndex = this.location.z + '';
    }
}
customElements.define('reverie-location', LocationComponent);