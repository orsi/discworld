import { Entity as EntityModel, Speech } from '../../common/models';
import { World } from '../components';
import { Entity } from '../components';
import Point3D from '../../common/data/point3d';

const MAX_TALK_MS: number = 5000;
const RUN_DELAY_MS: number = 200;
const WALK_DELAY_MS: number = 400;
export default class EntityController {
    world: World;
    serial: string;
    entity: EntityModel;
    component: Entity;
    currentSpeech: Speech[] = [];
    currentX: number;
    currentY: number;
    currentZ: number;
    lastX: number;
    lastY: number;
    lastZ: number;
    lastMovement: number = 0;
    elapsedTime = 0;
    constructor (world: World, entity: EntityModel) {
        this.world = world;
        this.entity = entity;
        this.component = new Entity(this, this.world.renderer);
    }
    update (delta: number) {
        this.elapsedTime += delta;

        // remove expired speech from curent speech
        for (let i = this.currentSpeech.length - 1; i >= 0; i--) {
            let speech = this.currentSpeech[i];
            if (this.elapsedTime - speech.createdAt > MAX_TALK_MS) this.currentSpeech.splice(i, 1);
        }

        if (this.elapsedTime - this.lastMovement > WALK_DELAY_MS) {
            this.currentX = this.entity.x;
            this.currentY = this.entity.y;
            this.currentZ = this.entity.z;
        } else {
            let movementDelta = (this.elapsedTime - this.lastMovement) / WALK_DELAY_MS;
            this.currentX = this.lastX + movementDelta * (this.entity.x - this.lastX);
            this.currentY = this.lastY + movementDelta * (this.entity.y - this.lastY);
            this.currentZ = this.lastZ + movementDelta * (this.entity.z - this.lastZ);
        }
    }
    moveTo (location: Point3D) {
        if (!this.canMove()) return;
        // this.lastPosition = this.position;
        // this.lastMovement = this.elapsedTime;
        // this.position = location;
    }
    canMove () {
        return !this.lastMovement || this.elapsedTime - this.lastMovement > WALK_DELAY_MS;
    }
    speak (text: string) {
        // let newSpeech = new Speech(text);
        // newSpeech.serial = uuid();
        // this.currentSpeech.unshift(newSpeech);
        // // only max 3 at a time
        // if (this.currentSpeech.length > 3) this.currentSpeech.pop();
        // this.entity.speech.push(newSpeech);
    }
}