import { Component } from '../component';

export class Title extends Component {
    constructor () {
        super();
    }
    connectedCallback () {
        super.connectedCallback();
    }
    get template() {
        return `
        <style>
            h1 {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: 64px;
                padding: 16px;
                font-family: 'Courier New';
                font-size: 2em;
                font-weight: 100;
                text-align: center;
            }
        </style>
        <h1>Reverie</h1>
        `;
    }
}
customElements.define('reverie-title', Title);
