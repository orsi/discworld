"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("../../common/utils/uuid");
const baseEntity_1 = require("../../common/entities/baseEntity");
class EntityManager {
    constructor(world) {
        this.entities = {};
        this.time = 0;
        this.world = world;
    }
    update(delta) {
        this.time += delta;
        for (let serial in this.entities) {
            this.entities[serial].update(delta);
        }
    }
    create() {
        let newEntity = new baseEntity_1.BaseEntity();
        newEntity.serial = uuid_1.uuid();
        this.entities[newEntity.serial] = newEntity;
        return newEntity;
    }
    remove(serial) {
        return delete this.entities[serial];
    }
    get(serial) {
        return this.entities[serial];
    }
    getAll() { return this.entities; }
    find(cb) {
        let entities = [];
        for (let serial in this.entities) {
            let e = this.entities[serial];
            if (cb(e))
                entities.push(e);
        }
        return entities;
    }
}
exports.EntityManager = EntityManager;
//# sourceMappingURL=entityManager.js.map