import { Entity } from './';

export class EntitySpeech {
    entity: Entity;
    text: string;
    createdAt: Date;
    constructor () {
        this.createdAt = new Date();
    }
}