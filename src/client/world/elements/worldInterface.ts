import { EventManager } from '../../EventManager';
import { Terminal } from '../elements/terminal';
import { WorldElement } from '../elements/world';
export class WorldInterface extends HTMLElement {
    events: EventManager;
    terminalElement: Terminal;
    worldElement: WorldElement;
    constructor (events: EventManager) {
        super();

        this.events = events;

        // setup canvas
        this.worldElement = new WorldElement(events);
        this.worldElement.style.position = 'absolute';
        this.worldElement.style.top = '0';
        this.worldElement.style.left = '0';
        this.worldElement.style.width = window.innerWidth + 'px';
        this.worldElement.style.height = window.innerHeight + 'px';
        this.worldElement.style.zIndex = '1';
        this.appendChild(this.worldElement);

        // setup terminal
        this.terminalElement = new Terminal(events);
        this.terminalElement.style.position = 'absolute';
        this.terminalElement.style.bottom = '0';
        this.terminalElement.style.left = '0';
        this.terminalElement.style.right = '0';
        this.terminalElement.style.height = '1em';
        this.terminalElement.style.zIndex = '2';
        this.terminalElement.style.lineHeight = '1em';
        this.terminalElement.style.fontFamily = 'Courier New';
        this.terminalElement.style.padding = '3px';
        this.terminalElement.style.whiteSpace = 'nowrap';
        this.terminalElement.style.outline = 'none';
        this.appendChild(this.terminalElement);
    }
    getTerminalElement () { return this.terminalElement; }
    getWorldElement () { return this.worldElement; }
}
window.customElements.define('reverie-interface', WorldInterface);