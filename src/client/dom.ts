import { Client } from './client';
import { WorldModule } from './worldModule';
import { EventChannel } from '../common/services/eventChannel';
import { Point } from '../common/data/point';
import * as Components from './components/';
import { Viewport } from './viewport';
export class DOMRenderer {
    client: Client;
    root: Element;
    events: EventChannel;
    socket: SocketIO.Socket;
    viewport: Viewport;
    components: Components.Component[] = [];
    width: number;
    height: number;
    constructor (client: Client) {
        this.client = client;
        let events = this.events = client.events;

        // html setup
        this.root = <Element>document.querySelector('#reverie');

        // general browser events
        window.addEventListener('resize',       (e: Event) => this.onWindowResize(e));
        window.addEventListener('contextmenu',  (e) => e.preventDefault()); // prevents context menu

        // render viewport setup
        this.viewport = new Viewport(0, 0, window.innerWidth, window.innerHeight);

        // socket
        events.on('connect', (socket) => this.socket = socket);
    }
    render (interpolation: number) {
        this.components.forEach(c => c.render(this.viewport));
    }
    addComponent <T extends Components.Component> (comp: T) {
        this.components.push(comp);
        this.root.appendChild(comp);
        return comp;
    }
    removeComponent (serial: string) {
        let htmlElement = <Components.Component>document.querySelector('#' + serial);
        if (htmlElement) htmlElement.remove();
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i].serial === serial) {
                this.components.splice(i, 1);
                break;
            }
        }
    }
    onWindowResize (e: Event) {
        let window = <Window>e.currentTarget;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.viewport.setSize(this.width, this.height);
        this.components.forEach(c => c.resize(window.innerWidth, window.innerHeight));
    }
}