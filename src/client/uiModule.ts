import { Client } from './client';
import { Renderer } from './views/renderer';
import { WorldModule } from './worldModule';
import { EventChannel } from '../common/services/eventChannel';
import { UIElement } from './ui/uiElement';
import { TerminalElement } from './ui/terminalElement';
import { WorldElement } from './ui/worldElement';
import { ContainerElement } from './ui/containerElement';
import { Point } from '../common/data/point';
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

    height: number;
    width: number;
    center: Point;
    constructor (client: Client) {
        this.client = client;
        this.world = this.client.world;
        let events = this.events = client.events;

        // ui properties
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.center = new Point(window.innerWidth / 2, window.innerHeight / 2);

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
    time = 0;
    update (delta: number) {
        this.time += delta;
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
    lastMove = 0;
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
        if (this.move && this.time - this.lastMove >= 100) {
            this.lastMove = this.time;
            this.socket.emit('move', this.move);
        }
    }
    render (interpolation: number) {
        let agent = this.world.getAgentEntity();
        if (agent && agent.entity.location) {
            let viewPosition = this.renderer.view.mapWorldLocationToPixel(agent.entity.location.x, agent.entity.location.y, agent.entity.location.z);
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

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.center = new Point(window.innerWidth / 2, window.innerHeight / 2);

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

        if (this.isNorth(x, y)) direction += 'n';
        if (this.isEast(x, y)) direction += 'e';
        if (this.isWest(x, y)) direction += 'w';
        if (this.isSouth(x, y)) direction += 's';
        return direction;
    }
    getTheta (x: number, y: number) {
        // translate around origin
        x = x - this.center.x;
        y = y - this.center.y;
        // get angle
        let rad = Math.atan2(-1, 1) - Math.atan2(x, y);
        rad =  rad * 360 / (2 * Math.PI);
        if (rad < 0) rad += 360;
        return rad;
    }
    isNorth(x: number, y: number) {
        let theta = this.getTheta(x, y);
        return  theta >= 30 && theta <= 175;
    }
    isEast(x: number, y: number) {
        let theta = this.getTheta(x, y);
        return theta >= 110 && theta <= 245;
    }
    isWest(x: number, y: number) {
        let theta = this.getTheta(x, y);
        return theta >= 0 && theta <= 55
            || theta >= 280 && theta <= 360;
    }
    isSouth(x: number, y: number) {
        let theta = this.getTheta(x, y);
        return theta >= 225 && theta <= 315;
    }
}

interface InterfaceEvent {
    element: UIElement;
    event: Event;
}