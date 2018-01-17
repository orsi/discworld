import Component from '../component';
import { World } from '../';
import { WorldState, WorldRegion } from '../../../common/models';

export class WorldMapComponent extends Component {
    elapsedTime: number;
    land: boolean[];
    temperature: number[];
    elevation: number[];
    hydrology: number[];
    regions: WorldRegion[];
    constructor (
        public seed: string,
        public width: number,
        public height: number,
        public status: WorldState,
        public createdAt: Date
    ) {
        super();
    }

    get template () {
        return ``;
    }
}
customElements.define('reverie-world-map', WorldMapComponent);