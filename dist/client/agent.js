"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../common/utils");
class Agent {
    constructor(world, entity, component) {
        this.serial = utils_1.uuid();
        this.world = world;
        this.entity = entity;
        this.component = component;
    }
}
exports.Agent = Agent;
//# sourceMappingURL=agent.js.map