/** Dependencies */
import Component from '../component';
import { World as WorldModel } from '../../../common/models';

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
          let land = this.model.land[x][y];
          if (!land) continue;

          let temperature = Math.floor(this.model.temperature[x][y]);
          let fill = `rgb(${temperature},0,${256 - temperature})`;
          content += `
            <rect x="${x}" y="${y}" width="1" height="1" fill="${fill}" opacity="1" />
          `;
        }
      }
      content += `</g></svg>`;
    return style + content;
  }
}
customElements.define('reverie-land-grid', WorldOverview);