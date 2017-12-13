import { Entity, Speech, WorldLocation } from '../models';
import { Point3D } from '../data/point3d';
import { uuid } from '../utils';

const MAX_TALK_MS: number = 5000;
const RUN_DELAY_MS: number = 200;
const WALK_DELAY_MS: number = 400;
/**
 * Base Entity
 * Used to manipulate and control entity model data.
 */
export class BaseEntity extends Entity {
    currentSpeech: Speech[] = [];
    currentLocation: Point3D = new Point3D(0, 0, 0);
    lastMovement: number = 0;
    lastLocation: WorldLocation;
    constructor (model?: Entity) {
        super();
        if (model) {
            Object.assign(this, model);
            this.createdAt = new Date(this.createdAt);
        }
    }
    update (delta: number) {
        this.elapsedTime += delta;

        // remove expired speech from curent speech
        for (let i = this.currentSpeech.length - 1; i >= 0; i--) {
            let speech = this.currentSpeech[i];
            let isExpired = (this.createdAt.getTime() + this.elapsedTime) - speech.createdAt.getTime() > MAX_TALK_MS;
            if (isExpired) this.currentSpeech.splice(i, 1);
        }

        if (this.elapsedTime - this.lastMovement > WALK_DELAY_MS) {
            this.currentLocation.x = this.location.x;
            this.currentLocation.y = this.location.y;
            this.currentLocation.z = this.location.z;
        } else if (this.lastLocation) {
            let movementDelta = (this.elapsedTime - this.lastMovement) / WALK_DELAY_MS;
            this.currentLocation.x = this.lastLocation.x + movementDelta * (this.location.x - this.lastLocation.x);
            this.currentLocation.y = this.lastLocation.y + movementDelta * (this.location.y - this.lastLocation.y);
            this.currentLocation.z = this.lastLocation.z + movementDelta * (this.location.z - this.lastLocation.z);
        }
    }
    moveTo (location: WorldLocation) {
        if (!this.canMove()) return;
        this.lastLocation = this.location;
        this.lastMovement = this.elapsedTime;
        this.location = location;
    }
    canMove () {
        return !this.lastMovement || this.elapsedTime - this.lastMovement > WALK_DELAY_MS;
    }
    speak (text: string) {
        let newSpeech = new Speech(text);
        newSpeech.serial = uuid();
        this.currentSpeech.unshift(newSpeech);
        // only max 3 at a time
        if (this.currentSpeech.length > 3) this.currentSpeech.pop();
        this.speech.push(newSpeech);
    }
}