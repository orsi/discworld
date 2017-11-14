import { Client } from './client';
import { ClientUI } from './clientUI';
import { Input } from './input';
import { World } from './world';
import { EventManager } from '../common/eventManager';
import { WorldModel } from '../common/world/models/worldModel';
import { Entity } from '../common/ecs/entity';

/**
 * Manages all events between input,
 * world, and ui.
 */
export class ClientInputHandler {
    client: Client;
    ui: ClientUI;
    events: EventManager;
    input: Input;
    world: World;
    totalTime = 0;
    lastMouse: MouseEvent;
    isMouseRightDown = false;
    lastMovement = 0;
    constructor (client: Client) {
        this.client = client;
        this.ui = this.client.ui;
        this.input = this.client.input;
        this.world = this.client.world;

        let events = this.events = this.client.events;
        events.registerEvent('window/resize',       (e: Event) => this.onWindowResize(e));
        events.registerEvent('input/keydown',       (e: KeyboardEvent) => this.onKeyDown(e));
        events.registerEvent('input/keyup',         (e: KeyboardEvent) => this.onKeyUp(e));
        events.registerEvent('input/mousedown',     (e: MouseEvent) => this.onMouseDown(e));
        events.registerEvent('input/mouseup',       (e: MouseEvent) => this.onMouseUp(e));
        events.registerEvent('input/mousemove',     (e: MouseEvent) => this.onMouseMove(e));
        events.registerEvent('input/mousewheel',    (e: WheelEvent) => this.onMouseWheel(e));
    }
    update (delta: number) {
        this.totalTime += delta;
        if (this.isMouseRightDown && (this.totalTime - this.lastMovement) > 500) {
            this.lastMovement = this.totalTime;
            this.world.moveEntity(this.parseMouseDirection(this.lastMouse.x, this.lastMouse.y));
        }
    }
    onWindowResize (e: Event) {
        let window = <Window>e.currentTarget;
        this.ui.resize(window.innerWidth, window.innerHeight);
    }
    onKeyDown (e: KeyboardEvent) {
        if (e.ctrlKey || e.altKey) {
            // do command
        } else {
            this.ui.onKey(e.key);
        }
    }
    onKeyUp (e: KeyboardEvent) {
        console.log('key up', e);
    }
    onMouseDown (e: MouseEvent) {
        this.lastMouse = e;
        if ((e.buttons & 0x2) !== 0) this.isMouseRightDown = true;
    }
    onMouseUp (e: MouseEvent) {
        this.lastMouse = e;
        if ((e.buttons & 0x2) === 0) this.isMouseRightDown = false;
    }
    onMouseMove (e: MouseEvent) {
        this.lastMouse = e;
    }
    onMouseWheel (e: WheelEvent) {
        console.log('mouse wheel', e);
    }

    checkDistance (x: number, y: number, mx: number, my: number, maxDistance: number) {
        return Math.abs(mx - x) + Math.abs(my - y) < maxDistance;
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