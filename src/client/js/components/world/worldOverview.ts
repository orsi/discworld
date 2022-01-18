/** Dependencies */
import Component from '../component';
import { default as WorldModel } from '../../../../common/models/world';
import { BIOMES } from '../../../../common/data/static/biomes';

export default class WorldOverview extends Component {
  canvas: HTMLCanvasElement = document.createElement('canvas');
  ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
  model: WorldModel;
  constructor(model: WorldModel) {
    super();
    this.model = model;

    this.canvas.width = this.model.width;
    this.canvas.height = this.model.height;
  }
  connectedCallback() {
    super.connectedCallback();
    this.shadow.appendChild(this.canvas);
  }
  get template() {
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
        max-width: 120px;
        max-height: 120px;
      }
      canvas {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    </style>
    `;
    return style;
  }

  rendered = false;
  update(delta: number) {
    if (!this.rendered) {
      for (let y = 0; y < this.model.height; y++) {
        for (let x = 0; x < this.model.width; x++) {
          let location = this.model.map[x][y];
          if (!location.land) continue;

          let fill = `rgba(0,0,0,0)`;
          switch (location.biome) {
            case BIOMES.VOID:
              // fill = `#171717`;
              break;
            case BIOMES.TUNDRA:
              fill = `#b3b5d8`;
              break;
            case BIOMES.DESERT:
              fill = `#ebae87`;
              break;
            case BIOMES.FOREST:
              fill = `#24561e`;
              break;
            case BIOMES.GRASSLAND:
              fill = `#34b30b`;
              break;
            case BIOMES.HEATHLAND:
              fill = `#2a83c3`;
              break;
            case BIOMES.SAVANNA:
              fill = `#b33839`;
              break;
            case BIOMES.MIRE:
              fill = `#187a65`;
              break;
            case BIOMES.RIVER:
              fill = `#348d9f`;
              break;
            case BIOMES.LAKE:
              fill = `#184464`;
              break;
            case BIOMES.SEA:
              fill = `#082a42`;
              break;
            case BIOMES.HILLS:
              fill = `#13b569`;
              break;
            case BIOMES.MOUNTAINS:
              fill = `#915143`;
              break;
          }
          this.ctx.fillStyle = fill;
          this.ctx.fillRect(x, y, 1, 1);
        }
      }
      this.rendered = true;
    }
  }
}
customElements.define('discworld-land-grid', WorldOverview);
