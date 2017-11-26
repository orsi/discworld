import { Client } from './client';
import { Renderer } from './views/renderer';
import { WorldModule } from './worldModule';
import { EventChannel } from '../common/services/eventChannel';
import { UIElement } from './ui/uiElement';
import { TerminalElement } from './ui/terminalElement';
import { WorldElement } from './ui/worldElement';
import { ContainerElement } from './ui/containerElement';
export class UIModule {
    client: Client;
    events: EventChannel;
    socket: SocketIO.Socket;
    interfaceEvents: InterfaceEvent[] = [];
    world: WorldModule;
    renderer: Renderer;
    htmlBody: HTMLBodyElement;
    worldElement: WorldElement;
    containerElement: ContainerElement;
    terminalElement: TerminalElement;
    elements: { [key: string]: UIElement } = {};
    focus: UIElement | void;
    constructor (client: Client) {
        this.client = client;
        this.world = this.client.world;
        let events = this.events = client.events;

        // html setup
        this.htmlBody = <HTMLBodyElement>document.querySelector('body');

        // create world element
        this.worldElement = new WorldElement(this);
        this.worldElement.style.zIndex = '1';
        this.htmlBody.appendChild(this.worldElement);

        // terminal
        this.terminalElement = new TerminalElement(this);
        this.terminalElement.style.zIndex = '3';
        this.htmlBody.appendChild(this.terminalElement);

        // UIElement container
        this.containerElement = new ContainerElement(this);
        this.containerElement.style.zIndex = '2';
        this.htmlBody.appendChild(this.containerElement);

        // create renderer for world
        this.renderer = new Renderer(
            this.world.view,
            this.worldElement.canvas,
            this.worldElement.bufferCanvas
        );

        // general browser events
        window.addEventListener('resize',       (e: Event) => this.onWindowResize(e));
        window.addEventListener('keydown',      (e: KeyboardEvent) => this.onKeyDown(e));
        window.addEventListener('keyup',        (e: KeyboardEvent) => this.onKeyUp(e));
        window.addEventListener('contextmenu',  (e) => e.preventDefault()); // prevents context menu

        // socket
        events.on('connect', (data) => this.onServerConnect(data));
    }

    update (delta: number) {
        // process input events
        this.process(delta);

        // do events
        this.emit();

        // process renderer
        this.render(delta / this.client.tickTime);
    }
    onServerConnect (socket: SocketIO.Socket) {
        this.socket = socket;
    }
    onTerminalMessage (message: string) {
        console.log('>> message sent: ', message);
        this.socket.emit('message', message);
    }
    move: string | void = '';
    process (delta: number) {
        for (let iEvent of this.interfaceEvents) {
            // do event parse
            if (iEvent.element.name === 'world') {
                if (iEvent.event.type === 'mousedown') {
                    let e = <MouseEvent>iEvent.event;
                    // world click
                    if (e.button === 2) this.move = this.parseMouseDirection(e.x, e.y);
                }
            }
            if (iEvent.event.type === 'mouseup') {
                let e = <MouseEvent>iEvent.event;
                // world click
                if (e.button === 2) this.move = undefined;
            }
            if (iEvent.event.type === 'mousemove') {
                let e = <MouseEvent>iEvent.event;
                // if moving
                if (this.move) this.move = this.parseMouseDirection(e.x, e.y);
            }
        }
        // reset events
        this.interfaceEvents.length = 0;
    }
    emit () {
        if (this.move) this.socket.emit('move', this.move);
    }
    render (interpolation: number) {
        let agent = this.world.getAgentEntity();
        if (agent) {
            let viewPosition = this.renderer.view.mapWorldLocationToPixel(agent.entity.x, agent.entity.y);
            this.renderer.view.center(viewPosition.x, viewPosition.y);
        }
        this.renderer.render(interpolation);
    }
    resize (width: number, height: number) {
        this.worldElement.resize(width, height);
        this.renderer.setViewportSize(width, height);
    }
    addEvent (el: UIElement, e: Event) {
        this.interfaceEvents.push({
            element: el,
            event: e
        });
    }
    onWindowResize (e: Event) {
        let window = <Window>e.currentTarget;
        this.resize(window.innerWidth, window.innerHeight);
    }
    onKeyDown (e: KeyboardEvent) {
        if (e.ctrlKey || e.altKey || e.metaKey) {
            // do command
        } else {
            this.terminalElement.onKey(e.key);
        }
    }
    onKeyUp (e: KeyboardEvent) {}

    addElement (el: UIElement) {
        this.elements[el.serial] = el;
        this.containerElement.appendChild(el);
    }
    removeElement (serial: string) {
        let htmlElement = <HTMLElement>document.querySelector('#' + serial);
        if (htmlElement) htmlElement.remove();
        delete this.elements[serial];
    }
    getTerminalElement (): TerminalElement { return this.terminalElement; }
    getWorldElement (): WorldElement { return this.worldElement; }
    getUIContainerElement (): ContainerElement { return this.containerElement; }
    getUIElements() { return this.elements; }

    isOnUserInterface (x: number, y: number) {
        let hasPoint = false;
        // check all ui elements and see if position is within them
        for (let el in this.elements) {
            if (this.elements[el].hasPoint(x, y)) {
                hasPoint = true;
                break;
            }
        }
        return hasPoint;
    }
    parseMouseDirection (x: number, y: number) {
        let direction = '';
        let width = window.innerWidth;
        let height = window.innerHeight;

        if (y <= Math.floor(height * (1 / 3))) direction += 'n';
        if (y >= Math.floor(height * (2 / 3))) direction += 's';
        if (x >= Math.floor(width * (2 / 3))) direction += 'e';
        if (x <= Math.floor(width * (1 / 3))) direction += 'w';
        return direction;
    }
    isNorth(x: number, y: number) {
        let x1 = 0;
        let y1 = 0;
        let x2 = window.innerWidth;
        let y2 = 0;
        let x3 = 0;
        let y3 = window.innerHeight;
    }
    isEast(x: number, y: number) {}
    isWest(x: number, y: number) {}
    isSouth(x: number, y: number) {}
}

interface InterfaceEvent {
    element: UIElement;
    event: Event;
}