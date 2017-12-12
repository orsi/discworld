"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const MAX_TALK_TIME = 5000;
/**
 * Base Entity
 * Used to manipulate and control entity model data.
 */
class BaseEntity extends models_1.Entity {
    constructor(model) {
        super();
        if (model) {
            Object.assign(this, model);
            this.createdAt = new Date(this.createdAt);
        }
    }
    update(delta) {
        this.elapsedTime += delta;
        let talkExpired = this.lastSpeech && (this.createdAt.getTime() + this.elapsedTime) - this.lastSpeech.createdAt.getTime() > MAX_TALK_TIME;
        if (talkExpired)
            this.lastSpeech = undefined;
    }
    moveTo(location) {
        this.location = location;
    }
    speak(text) {
        let newSpeech = this.lastSpeech = new models_1.Speech(text);
        this.speech.push(newSpeech);
    }
}
exports.BaseEntity = BaseEntity;
//# sourceMappingURL=baseEntity.js.map