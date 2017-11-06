import { EventManager } from '../common/eventManager';
import { Entity } from 'common/ecs/entity';

export class Agent {
    events: EventManager;
    entity: Entity | void;
    constructor(events: EventManager) {
        this.events = events;
    }
    setEntity (entity: Entity) {
        this.entity = entity;
        console.log('set entity', entity);
    }
    getEntity () {
        return this.entity;
    }
}