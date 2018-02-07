/** Dependencies */
import Component from '../component';
import { World as WorldModel } from '../../../common/models';
import { BIOMES } from '../../../common/data/static/biomes';

export default class WorldOverview extends Component {
    model: WorldModel;
  constructor  (model: WorldModel) {
    super();
    this.model = model;
  }
  connectedCallback () {
      super.connectedCallback();
  }
  get template () {
    const style = `
    <style>
      :host {
        position: absolute;
        z-index: 55;
        display: block;
        top: 0;
        right: 0;
        width: ${this.model.width}px;
        height: ${this.model.height}px;
      }
      svg {
        overflow: visible;
        display: inline-block;
        background-color: rgba(0,0,0,.6);
        width: 100%;
        height: 100%;
      }
    </style>
    `;

    let content = '';
    content = `
        <svg>
          <g>
      `;
      for (let y = 0; y < this.model.height; y++) {
        for (let x = 0; x < this.model.width; x++) {
          let location = this.model.map[x][y];
          if (!location.land) continue;

          let fill = `rgba(0,0,0,0)`;
          switch (location.biome) {
            case BIOMES.VOID:
              fill = `rgba(10,10,10,1)`;
              break;
            case BIOMES.TUNDRA:
              fill = `rgba(230,230,230,1)`;
              break;
            case BIOMES.DESERT:
              fill = `rgba(93,79,69,1)`;
              break;
            case BIOMES.FOREST:
              fill = `rgba(34,139,34,1)`;
              break;
            case BIOMES.GRASSLAND:
              fill = `rgba(124,252,0,1)`;
              break;
            case BIOMES.HEATHLAND:
              fill = `rgba(138,43,226,1)`;
              break;
            case BIOMES.SAVANNA:
              fill = `rgba(210,129,86,1)`;
              break;
            case BIOMES.MIRE:
              fill = `rgba(62,68,60,1)`;
              break;
            case BIOMES.RIVER:
              fill = `rgba(23,70,81,1)`;
              break;
            case BIOMES.LAKE:
              fill = `rgba(104,120,201,1)`;
              break;
            case BIOMES.SEA:
              fill = `rgba(0,105,148,1)`;
              break;
            case BIOMES.HILLS:
              fill = `rgba(102,204,0,1)`;
              break;
            case BIOMES.MOUNTAINS:
              fill = `rgba(150,141,153,1)`;
              break;
          }
          content += `
            <rect x="${x}" y="${y}" width="1" height="1" fill="${fill}" opacity=".9" />
          `;
        }
      }
      content += `</g></svg>`;
    return style + content;
  }
}
customElements.define('reverie-land-grid', WorldOverview);