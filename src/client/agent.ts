import { EventManager } from '../common/eventManager';
import { Entity } from 'common/ecs/entity';
import { InputManager } from './inputManager';

export class Agent {
    events: EventManager;
    input: InputManager;
    entity: Entity | void;
    lastMove: number;
    movementDelay = 250;
    lastMovement = 0;
    totalTime = 0;
    constructor(events: EventManager, input: InputManager) {
        this.events = events;
        this.input = input;
    }
    update (delta: number) {
        this.totalTime += delta;
        this.getInput();
    }
    getInput() {
        if (this.input.mouse.right && (this.totalTime - this.lastMovement) > this.movementDelay) {
            this.events.emit('agent/move', { x: this.input.mouse.x, y: this.input.mouse.y });
            this.lastMovement = this.totalTime;
        }
    }
    setEntity (entity: Entity) {
        this.entity = entity;
        console.log('set entity', entity);
    }
    getEntity () {
        return this.entity;
    }
}