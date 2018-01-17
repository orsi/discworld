import Component from './component';
import * as Components from './';

/** Services */
import * as dom from '../dom';
import * as server from '../reverieServer';

/** Data */
import * as Packets from '../../common/data/net';

export default class Reverie extends Component {
    terminal: Components.Terminal;
    conscience: Components.Conscience;
    constructor () {
        super();
    }
    connectedCallback () {
        super.connectedCallback();

        // create terminal
        this.terminal = new Components.Terminal();
        dom.render(this.terminal, this);
        this.terminal.addEventListener('terminal-message', (e: Event) => {
            server.send(new Packets.Client.Message((<CustomEvent>e).detail));
        });

        // create server message window
        this.conscience = new Components.Conscience();
        dom.render(this.conscience, this);
        server.on('server/message', (p: Packets.Server.Message) => this.conscience.print(p.message));
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
