import { Client } from './client';
import { Renderer } from './renderer';
import { World } from './world';
import * as Components from '../common/ecs/component';
import { EventManager } from '../common/eventManager';
import { TerminalElement } from './elements/terminalElement';
import { WorldElement } from './elements/worldElement';
import { UIElement } from './elements/ui/uiElement';
import { UIContainerElement } from './elements/uiContainerElement';
export class ClientUI {
    client: Client;
    events: EventManager;
    world: World;
    renderer: Renderer;
    htmlBody: HTMLBodyElement;
    worldElement: WorldElement;
    uiContainer: HTMLElement;
    terminalElement: TerminalElement;
    elements: { [key: string]: UIElement } = {};
    constructor (client: Client) {
        this.client = client;
        this.world = this.client.world;
        let events = this.events = client.events;

        // html setup
        this.htmlBody = <HTMLBodyElement>document.querySelector('body');

        // create world element
        this.worldElement = new WorldElement();
        this.worldElement.style.position = 'absolute';
        this.worldElement.style.top = '0';
        this.worldElement.style.left = '0';
        this.worldElement.style.width = window.innerWidth + 'px';
        this.worldElement.style.height = window.innerHeight + 'px';
        this.worldElement.style.zIndex = '1';
        this.htmlBody.appendChild(this.worldElement);

        // create renderer for world
        this.renderer = new Renderer(
            this.world,
            this.worldElement.canvas,
            this.worldElement.bufferCanvas
        );

        // UIElement container
        this.uiContainer = new UIContainerElement();
        this.uiContainer.style.position = 'absolute';
        this.uiContainer.style.top = '0';
        this.uiContainer.style.left = '0';
        this.uiContainer.style.width = window.innerWidth + 'px';
        this.uiContainer.style.height = window.innerHeight + 'px';
        this.uiContainer.style.zIndex = '2';
        this.htmlBody.appendChild(this.uiContainer);

        // terminal
        this.terminalElement = new TerminalElement(events);
        this.terminalElement.style.position = 'absolute';
        this.terminalElement.style.bottom = '0';
        this.terminalElement.style.left = '0';
        this.terminalElement.style.right = '0';
        this.terminalElement.style.height = '1em';
        this.terminalElement.style.zIndex = '3';
        this.htmlBody.appendChild(this.terminalElement);
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
    onKey (key: string) {
        this.terminalElement.onKey(key);
    }
    addElement (el: UIElement) {
        this.elements[el.serial] = el;
        this.uiContainer.appendChild(el);
    }
    removeElement (serial: string) {
        let htmlElement = <HTMLElement>document.querySelector('#' + serial);
        if (htmlElement) htmlElement.remove();
        delete this.elements[serial];
    }
    getTerminalElement (): TerminalElement { return this.terminalElement; }
    getWorldElement (): WorldElement { return this.worldElement; }
    getUIContainerElement (): UIContainerElement { return this.uiContainer; }
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
}