import Component from '../component';

export default class Title extends Component {
    constructor () {
        super();
    }
    connectedCallback () {
        super.connectedCallback();
    }
    get template() {
        return `
        <style>
            :host {
                display: block;
                position: absolute;
                z-index: 11;
                top: 60px;
                right: 0;
                left: 0;
            }
            h1 {
                font-family: 'Courier New';
                font-size: 2em;
                font-weight: 100;
                text-align: center;
                margin: 0;
            }
            div {
                font-size: .8em;
                text-align: center;
            }
        </style>
        <h1>Discworld</h1>
        <div><small>Type and press enter. Right-click to move. Mouse wheel to zoom.</small></div>
        `;
    }
}
customElements.define('discworld-title', Title);
