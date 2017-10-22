import { EventManager } from './EventManager';
import { Terminal } from './components/terminal';
import { Canvas } from './components/canvas';
export class GUI {
    events: EventManager;
    container: HTMLElement;
    terminal: Terminal;
    canvas: Canvas;
    constructor (container: HTMLElement, events: EventManager) {
        this.events = events;
        this.container = container;

        // setup body container
        this.container.style.position = 'relative';

        // setup canvas
        this.canvas = new Canvas(events);
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.canvas.style.zIndex = '1';
        container.appendChild(this.canvas);

        // setup terminal
        this.terminal = new Terminal(events);
        this.terminal.style.position = 'fixed';
        this.terminal.style.bottom = '0';
        this.terminal.style.left = '0';
        this.terminal.style.right = '0';
        this.terminal.style.height = '1em';
        this.terminal.style.zIndex = '2';
        this.terminal.style.lineHeight = '1em';
        this.terminal.style.fontFamily = 'Courier New';
        this.terminal.style.padding = '3px';
        this.terminal.style.whiteSpace = 'nowrap';
        this.terminal.style.outline = 'none';
        container.appendChild(this.terminal);
    }
    getTerminal () { return this.terminal; }
    getCanvas () { return this.canvas; }
}