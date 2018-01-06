import { Component } from './';
import { WorldRegion } from '../../common/models';
import { Point2D } from '../../common/data/point2d';
import { ELEMENTS } from '../../common/data/static/elements';
import { WorldRenderer } from '../world/worldRenderer';

export class RegionComponent extends Component {
    renderer: WorldRenderer;
    region: WorldRegion;
    svg: SVGSVGElement;
    constructor (region: WorldRegion, renderer: WorldRenderer) {
        super();
        this.region = region;
        this.renderer = renderer;
    }
    connectedCallback () {
        super.connectedCallback();
        this.style.display = 'inline-block';
        this.style.position = 'absolute';
    }
    render () {
        let viewPosition = this.renderer.mapRegionToPixel(this.region.x, this.region.y, this.region.z);
        if (!this.renderer.isOnScreen(this.region.x, this.region.y, this.region.y)) {
            this.style.display = 'none';
            return;
        }
        this.style.display = 'inline-block';
    }
}
customElements.define('reverie-region', RegionComponent);