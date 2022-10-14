import Component from './component';
import Terminal from './ui/terminal';
import Conscience from './ui/conscience';
import * as dom from '../dom';

export default class Discworld extends Component {
    terminal: Terminal;
    conscience: Conscience;
    constructor() {
        super();
    }
    connectedCallback() {
        super.connectedCallback();

        // create terminal
        this.terminal = new Terminal();
        this.terminal.style.position = '10';
        this.terminal.style.zIndex = '10';
        dom.render(this.terminal, this);

        // create server message window
        this.conscience = new Conscience();
        this.conscience.style.position = '10';
        this.conscience.style.zIndex = '10';
        dom.render(this.conscience, this);
    }
    get template() {
        return `
            <style>
                :host {
                    display: block;
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    overflow: hidden;
                }
            </style>
        `;
    }
}
customElements.define('discworld-main', Discworld);
