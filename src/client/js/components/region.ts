import Component from './component';
import WorldRegion from '../../../common/models/region';
import { ELEMENTS } from '../../../common/data/static/elements';
import WorldRenderer from '../world/worldRenderer';

export default class Region extends Component {
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
customElements.define('discworld-region', Region);