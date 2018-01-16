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
            :host {
                display: block;
                position: absolute;
                top: 60px;
                right: 0;
                left: 0;
                padding: 16px;
                font-family: 'Courier New';
                font-size: 2em;
                font-weight: 100;
                text-align: center;
            }
        </style>
        Reverie
        `;
    }
}
customElements.define('reverie-title', Title);
