import { Client } from './client';
import { Renderer } from './renderer';
import { World } from './world';
import * as Components from '../common/ecs/component';
import { EventManager } from '../common/eventManager';
import { UIElement } from './ui/uiElement';
import { TerminalElement } from './ui/terminalElement';
import { WorldElement } from './ui/worldElement';
import { ContainerElement } from './ui/containerElement';
export class ClientUI {
    client: Client;
    events: EventManager;
    world: World;
    renderer: Renderer;
    htmlBody: HTMLBodyElement;
    worldElement: WorldElement;
    containerElement: ContainerElement;
    terminalElement: TerminalElement;
    elements: { [key: string]: UIElement } = {};
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
    }

    update (delta: number) {
        let agent = this.world.getAgentEntity();
        if (agent) {
            let position = agent.getComponent<Components.PositionComponent>('position');
            if (position) {
                let viewPosition = this.renderer.view.mapWorldLocationToPixel(position.x, position.y);
                this.renderer.view.center(viewPosition.x, viewPosition.y);
            }
        }
        this.renderer.render(delta / this.client.tickTime);
    }
    resize (width: number, height: number) {
        this.worldElement.resize(width, height);
        this.renderer.setViewportSize(width, height);
    }
    onWindowResize (e: Event) {
        let window = <Window>e.currentTarget;
        this.resize(window.innerWidth, window.innerHeight);
    }
    onKeyDown (e: KeyboardEvent) {
        if (e.ctrlKey || e.altKey || e.metaKey) {
            // do command
        } else {
            this.onKey(e.key);
        }
    }
    onKeyUp (e: KeyboardEvent) {}
    onKey (key: string) {
        this.terminalElement.onKey(key);
    }
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
    onMouseDown (e: MouseEvent) {
        console.log('click on ui', e);
    }
    onMouseUp (e: MouseEvent) {

    }
    parseMouseDirection (x: number, y: number) {
        let direction = '';
        let mouseX = x;
        let mouseY = y;
        let width = window.innerWidth;
        let height = window.innerHeight;

        if (mouseY <= Math.floor(height * (1 / 3))) direction += 'n';
        if (mouseY >= Math.floor(height * (2 / 3))) direction += 's';
        if (mouseX >= Math.floor(width * (2 / 3))) direction += 'e';
        if (mouseX <= Math.floor(width * (1 / 3))) direction += 'w';
        return direction;
    }
}