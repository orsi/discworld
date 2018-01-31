/** Dependencies */
import Component from '../component';
import { World as WorldModel } from '../../../common/models';

export default class LandGrid extends Component {
    land: boolean[][];
    width: number;
    height: number;
  constructor  (land: boolean[][], width: number, height: number) {
    super();
    this.land = land;
    this.width = width;
    this.height = height;
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
        width: ${this.width}px;
        height: ${this.height}px;
      }
      svg {
        overflow: visible;
        display: inline-block;
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
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          let land = this.land[x][y];
          let fill = land ? 'blue' : 'white';
          content += `
            <rect x="${x}" y="${y}" width="1" height="1" fill="${fill}" opacity=".8" />
          `;
        }
      }
      content += `</g></svg>`;
    return style + content;
  }
}
customElements.define('reverie-land-grid', LandGrid);