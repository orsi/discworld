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
        this.style.backgroundColor = `rgba(${color})`;
        this.style.width = this.renderer.BLOCK_SIZE + 'px';
        this.style.height = this.renderer.BLOCK_SIZE + 'px';

        // // neighbouring tiles
        // let n = map[ix] ? map[ix][iy - 1] : undefined;
        // let ne = map[ix + 1] ? map[ix + 1][iy - 1] : undefined;
        // let e = map[ix + 1] ? map[ix + 1][iy] : undefined;
        // let se = map[ix + 1] ? map[ix + 1][iy + 1] : undefined;
        // let s = map[ix] ? map[ix][iy + 1] : undefined;
        // let sw = map[ix - 1] ? map[ix - 1][iy + 1] : undefined;
        // let w = map[ix - 1] ? map[ix - 1][iy] : undefined;
        // let nw = map[ix - 1] ? map[ix - 1][iy - 1] : undefined;

        // // find the average of the 3 surrounding corner tiles
        // let topSkew = 0, rightSkew = 0, bottomSkew = 0, leftSkew = 0;
        // // top corner
        // topSkew += n && n.z >= 0 ? (z - n.z) * viewport.view.BLOCK_SIZE * 0.5 * 0.3 : 0;
        // topSkew += ne && ne.z >= 0 ? (z - ne.z) * viewport.view.BLOCK_SIZE * 0.5 * 0.3 : 0;
        // topSkew += e && e.z >= 0 ? (z - e.z) * viewport.view.BLOCK_SIZE * 0.5 * 0.3 : 0;
        // // right corner
        // rightSkew += e && e.z >= 0 ? (z - e.z) * viewport.view.BLOCK_SIZE * 0.5 * 0.3 : 0;
        // rightSkew += se && se.z >= 0 ? (z - se.z) * viewport.view.BLOCK_SIZE * 0.5 * 0.3 : 0;
        // rightSkew += s && s.z >= 0 ? (z - s.z) * viewport.view.BLOCK_SIZE * 0.5 * 0.3 : 0;
        // // bottom corner
        // bottomSkew += s && s.z >= 0 ? (z - s.z) * viewport.view.BLOCK_SIZE * 0.5 * 0.3 : 0;
        // bottomSkew += sw && sw.z >= 0 ? (z - sw.z) * viewport.view.BLOCK_SIZE * 0.5 * 0.3 : 0;
        // bottomSkew += w && w.z >= 0 ? (z - w.z) * viewport.view.BLOCK_SIZE * 0.5 * 0.3 : 0;
        // // left corner
        // leftSkew += w && w.z >= 0 ? (z - w.z) * viewport.view.BLOCK_SIZE * 0.5 * 0.3 : 0;
        // leftSkew += nw && nw.z >= 0 ? (z - nw.z) * viewport.view.BLOCK_SIZE * 0.5 * 0.3 : 0;
        // leftSkew += n && n.z >= 0 ? (z - n.z) * viewport.view.BLOCK_SIZE * 0.5 * 0.3 : 0;

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
        let viewPosition = this.renderer.mapWorldLocationToPixel(this.location.x, this.location.y, this.location.z);
        if (!this.renderer.isOnScreen(this.location.x, this.location.y, this.location.z)) {
            this.style.display = 'none';
            return;
        }
        // let x = viewPosition.x + this.viewport.xOffset + this.viewport.xCenter;
        // let y = viewPosition.y + this.viewport.yOffset + this.viewport.yCenter;
        // let z = this.location.z;
        this.style.display = 'inline-block';
        this.style.transform = `translate(${viewPosition.x}px, ${viewPosition.y}px) rotateX(60deg) rotateY(0deg) rotateZ(-45deg)`;
        this.style.zIndex = this.location.z + '';
    }
}
customElements.define('reverie-location', LocationComponent);