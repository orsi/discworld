import { EventManager } from '../common/eventManager';
import { TerminalElement } from './elements/terminalElement';
import { WorldElement } from './elements/worldElement';
import { InterfaceElement } from './elements/interfaceElements';
export class ReverieInterface {
    events: EventManager;
    htmlBody: HTMLBodyElement;
    terminalElement: TerminalElement;
    worldElement: WorldElement;
    elements: InterfaceElement[] = [];
    constructor (events: EventManager) {
        this.events = events;
        this.htmlBody = <HTMLBodyElement>document.querySelector('body');

        // create world element
        this.worldElement = new WorldElement(events);
        this.worldElement.style.position = 'absolute';
        this.worldElement.style.top = '0';
        this.worldElement.style.left = '0';
        this.worldElement.style.width = window.innerWidth + 'px';
        this.worldElement.style.height = window.innerHeight + 'px';
        this.worldElement.style.zIndex = '1';
        this.htmlBody.appendChild(this.worldElement);

        // setup terminal
        this.terminalElement = new TerminalElement(events);
        this.terminalElement.style.position = 'absolute';
        this.terminalElement.style.bottom = '0';
        this.terminalElement.style.left = '0';
        this.terminalElement.style.right = '0';
        this.terminalElement.style.height = '1em';
        this.terminalElement.style.zIndex = '2';
        this.htmlBody.appendChild(this.terminalElement);
    }
    getTerminalElement (): TerminalElement { return this.terminalElement; }
    getWorldElement (): WorldElement { return this.worldElement; }
    getInterfaceElements(): InterfaceElement[] { return this.elements; }
}