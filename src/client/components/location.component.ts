import { Component } from './';
import { WorldLocation } from '../../common/models';
import { Point } from '../../common/data/point';
import { Tile } from '../../common/data/tiles';
import { Viewport } from '../viewport';

export class LocationComponent extends Component {
    location: WorldLocation;
    constructor (location: WorldLocation) {
        super();
        this.location = location;
    }
    connectedCallback () {
        super.connectedCallback();
        // tiles
        let color = '';
        switch (this.location.tile) {
            case Tile.ROCK:
                color = '150,150,150';
                break;
            case Tile.GRASS:
                color = '0,150,0';
                break;
            case Tile.WATER:
                color = '0,0,150';
                break;
            case Tile.DIRT:
                color = '150,120,0';
                break;
            case Tile.NULL:
                color = '45,45,45';
                break;
        }

        this.style.display = 'inline-block';
        this.style.position = 'absolute';
        this.style.backgroundColor = `rgb(${color})`;
        this.style.width = '16px';
        this.style.height = '16px';

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
    render (viewport: Viewport) {
        let viewPosition = viewport.mapWorldLocationToPixel(this.location.x, this.location.y, this.location.z);
        let x = viewPosition.x + viewport.xOffset + viewport.xCenter;
        let y = viewPosition.y + viewport.yOffset + viewport.yCenter;
        let z = this.location.z;
        this.style.left = x + 'px';
        this.style.top = y + 'px';
    }
}
customElements.define('reverie-location', LocationComponent);