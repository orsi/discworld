import { EventManager } from '../common/eventManager';
import { Entity } from 'common/ecs/entity';

export class Agent {
    events: EventManager;
    entityId: string;
    constructor(events: EventManager) {
        this.events = events;
    }
    setEntityId (id: string) {
        this.entityId = id;
    }
}