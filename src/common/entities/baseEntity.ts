import { Entity, Speech, WorldLocation } from '../models';
const MAX_TALK_TIME = 5000;
/**
 * Base Entity
 * Used to manipulate and control entity model data.
 */
export class BaseEntity extends Entity {
    lastSpeech: Speech | void;
    constructor (model?: Entity) {
        super();
        if (model) {
            Object.assign(this, model);
            this.createdAt = new Date(this.createdAt);
        }
    }
    update (delta: number) {
        this.elapsedTime += delta;
        let talkExpired = this.lastSpeech && (this.createdAt.getTime() + this.elapsedTime) - this.lastSpeech.createdAt.getTime() > MAX_TALK_TIME;
        if (talkExpired) this.lastSpeech = undefined;
    }
    moveTo (location: WorldLocation) {
        this.location = location;
    }
    speak (text: string) {
        let newSpeech = this.lastSpeech = new Speech(text);
        this.speech.push(newSpeech);
    }
}