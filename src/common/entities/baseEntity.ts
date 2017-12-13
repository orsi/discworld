import { Entity, Speech, WorldLocation } from '../models';
import { Point3D } from '../data/point3d';
const MAX_TALK_TIME: number = 5000;
const MOVEMENT_DELAY: number = 200;
/**
 * Base Entity
 * Used to manipulate and control entity model data.
 */
export class BaseEntity extends Entity {
    lastSpeech: Speech | void;
    lastLocation: WorldLocation;
    currentLocation: Point3D = new Point3D(0, 0, 0);
    lastMovement: number = 0;
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
        if (this.elapsedTime - this.lastMovement > MOVEMENT_DELAY) {
            this.currentLocation.x = this.location.x;
            this.currentLocation.y = this.location.y;
            this.currentLocation.z = this.location.z;
        } else if (this.lastLocation) {
            let movementDelta = this.elapsedTime - this.lastMovement;
            this.currentLocation.x = this.lastLocation.x + (movementDelta / MOVEMENT_DELAY) * (this.location.x - this.lastLocation.x);
            this.currentLocation.y = this.lastLocation.y + (movementDelta / MOVEMENT_DELAY) * (this.location.y - this.lastLocation.y);
            this.currentLocation.z = this.lastLocation.z + (movementDelta / MOVEMENT_DELAY) * (this.location.z - this.lastLocation.z);
        }
    }
    moveTo (location: WorldLocation) {
        if (!this.canMove()) return;
        this.lastLocation = this.location;
        this.lastMovement = this.elapsedTime;
        this.location = location;
    }
    canMove () {
        return !this.lastMovement || this.elapsedTime - this.lastMovement > MOVEMENT_DELAY;
    }
    speak (text: string) {
        let newSpeech = this.lastSpeech = new Speech(text);
        this.speech.push(newSpeech);
    }
}