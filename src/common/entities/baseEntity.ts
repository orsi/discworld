import { Entity, EntitySpeech } from '../models';
import { uuid } from '../utils/uuid';

export class BaseEntity {
    entity: Entity;
    currentSpeech: EntitySpeech | void;
    speech: EntitySpeech[] = [];
    totalTime = 0;
    constructor (entity?: Entity) {
        if (!entity) {
            entity = new Entity();
            entity.serial = uuid();
        }
        this.entity = entity;
    }
    update (delta: number) {
        this.totalTime += delta;
        if (this.currentSpeech
            && this.totalTime - this.currentSpeech.createdAt.getTime() > 5000) this.currentSpeech = undefined;
    }
    move (x: number, y: number) {
        this.entity.x = x;
        this.entity.y = y;
    }
    speak (speech: string) {
        let newSpeech = new EntitySpeech();
        newSpeech.text = speech;
        this.currentSpeech = newSpeech;
        this.speech.push(newSpeech);
    }
}