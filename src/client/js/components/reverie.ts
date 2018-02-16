import Component from './component';
import Terminal from './ui/terminal';
import Conscience from './ui/conscience';

/** Services */
import * as dom from '../dom';
import * as server from '../reverieServer';

/** Data */
import MessagePacket from '../../../common/data/net/client/message';
import { default as ServerMessagePacket } from '../../../common/data/net/client/message';

export default class Reverie extends Component {
    terminal: Terminal;
    conscience: Conscience;
    constructor () {
        super();
    }
    connectedCallback () {
        super.connectedCallback();

        // create terminal
        this.terminal = new Terminal();
        this.terminal.style.position = '10';
        this.terminal.style.zIndex = '10';
        dom.render(this.terminal, this);
        this.terminal.addEventListener('terminal-message', (e: Event) => {
            server.send(new MessagePacket((<CustomEvent>e).detail));
        });

        // create server message window
        this.conscience = new Conscience();
        this.conscience.style.position = '10';
        this.conscience.style.zIndex = '10';
        dom.render(this.conscience, this);
        server.on('server/message', (p: ServerMessagePacket) => this.conscience.print(p.message));
    }
    get template () {
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
customElements.define('reverie-main', Reverie);
