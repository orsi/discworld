import { Entity } from './';

export class Speech {
    entity: Entity;
    text: string;
    createdAt: Date;
    constructor () {
        this.createdAt = new Date();
    }
}