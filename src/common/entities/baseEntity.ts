import { Entity, Speech, WorldLocation } from '../models';

/**
 * Base Entity
 * Used to manipulate and control entity model data.
 */
export class BaseEntity extends Entity {
    lastSpeech: Speech | void;
    constructor (model: Entity) {
        super();
        this.serial = model.serial;
        this.name = model.name;
        this.type = model.type;
        this.health = model.health;
        this.mana = model.mana;
        this.stamina = model.stamina;
        this.strength = model.strength;
        this.dexterity = model.dexterity;
        this.intelligence = model.intelligence;
        this.location = model.location;
        this.deletedAt = model.deletedAt;
    }
    update (delta: number) {
        this.elapsedTime += delta;
        if (this.lastSpeech
            && (this.createdAt.getTime() + this.elapsedTime) - this.lastSpeech.createdAt.getTime() > 5000) {
            this.lastSpeech = undefined;
            console.log(this);
        }
    }
    moveTo (location: WorldLocation) {
        this.location = location;
    }
    speak (text: string) {
        let newSpeech = this.lastSpeech = new Speech(text);
        this.speech.push(newSpeech);
    }
}