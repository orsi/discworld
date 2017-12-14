import { WorldElement } from './';
import { WorldLocation } from '../../common/models';
import { Point2D } from '../../common/data/point2d';
import { Tile } from '../../common/data/tiles';
import { WorldRenderer } from '../world/worldRenderer';

export class LocationComponent extends WorldElement {
    location: WorldLocation;
    svg: SVGSVGElement;
    tileSvg: SVGPathElement;
    constructor (location: WorldLocation, renderer: WorldRenderer) {
        super(renderer);
        this.location = location;
    }
    connectedCallback () {
        super.connectedCallback();
        this.style.display = 'inline-block';
        this.style.position = 'absolute';
        this.width = this.height = this.renderer.BLOCK_SIZE;

        // tile
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('viewbox', `0 0 ${this.renderer.BLOCK_SIZE} ${this.renderer.BLOCK_SIZE}`);
        this.svg.style.overflow = 'visible';
        this.shadow.appendChild(this.svg);

        this.tileSvg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.svg.appendChild(this.tileSvg);

        // isometric
        let top = new Point2D(0, -(this.renderer.BLOCK_SIZE / 2) - (this.location.slants.top * this.renderer.BLOCK_SIZE / 2));
        let right = new Point2D(this.renderer.BLOCK_SIZE, 0 - (this.location.slants.right * this.renderer.BLOCK_SIZE / 2));
        let bottom = new Point2D(0, (this.renderer.BLOCK_SIZE / 2) - (this.location.slants.bottom * this.renderer.BLOCK_SIZE / 2));
        let left = new Point2D(-(this.renderer.BLOCK_SIZE), 0 - (this.location.slants.left * this.renderer.BLOCK_SIZE / 2));
        this.tileSvg.setAttribute('d',
            `M ${top.x} ${top.y} L ${right.x} ${right.y} L ${bottom.x} ${bottom.y} L ${left.x} ${left.y}`);

        // color
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
        this.tileSvg.setAttribute('fill', `rgba(${color})`);
    }
    render () {
        let viewPosition = this.renderer.mapToPixel(this.location);
        if (!this.renderer.isOnScreen(this.location.x, this.location.y, this.location.z)) {
            this.style.display = 'none';
            return;
        }
        this.style.display = 'inline-block';

        this.style.transform = `translate(${viewPosition.x - (this.width / 2)}px, ${viewPosition.y - (this.height / 2)}px)`;
        // this.style.zIndex = this.location.z + '';
    }
}
customElements.define('reverie-location', LocationComponent);