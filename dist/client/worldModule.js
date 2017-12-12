"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./components/");
const baseEntity_1 = require("../common/entities/baseEntity");
const worldRenderer_1 = require("./world/worldRenderer");
const agent_1 = require("./agent");
class WorldModule {
    constructor(client) {
        this.interfaceComponents = [];
        this.locations = {};
        this.entities = {};
        this.elapsedTime = 0;
        const events = this.events = client.events;
        this.renderer = new worldRenderer_1.WorldRenderer(this);
        this.worldComponent = client.dom.addComponent(new _1.WorldComponent(this, this.renderer));
        this.terminalComponent = client.dom.addComponent(new _1.TerminalComponent(this));
        events.on('connect', (data) => this.onServerConnect(data));
    }
    update(delta) {
        this.elapsedTime += delta;
        for (let serial in this.entities) {
            this.entities[serial].entity.update(delta);
        }
        this.renderer.update(delta);
    }
    destroy() { }
    // Events
    onServerConnect(socket) {
        this.socket = socket;
        socket.on('client/entity', (data) => this.onAgentEntity(data));
        socket.on('world/info', (data) => this.onInfo(data));
        socket.on('world/location', (data) => this.onLocation(data));
        socket.on('entity/speech', (entity, speech) => this.onAgentSpeech(entity, speech));
        socket.on('entity/move', (data) => this.onAgentMove(data));
        socket.on('entity/remove', (data) => this.onAgentRemove(data));
    }
    onAgentEntity(entity) {
        console.log('got client', entity.serial);
        // find base entity by serial or create
        let agent = this.getAgent(entity.serial);
        if (!agent)
            agent = this.createAgent(entity);
        // set main agent and follow
        this.mainAgent = agent;
        this.renderer.follow(this.mainAgent);
    }
    onInfo(world) {
        console.log('world info', world);
        this.world = world;
    }
    onLocation(location) {
        this.locations[location.serial] = location;
        this.worldComponent.addLocationComponent(location);
    }
    onAgentRemove(serial) {
        console.log('remove entity', serial);
        this.removeEntity(serial);
    }
    onAgentMove(entity) {
        let movedAgent = this.getAgent(entity.serial);
        if (!movedAgent)
            movedAgent = this.createAgent(entity);
        movedAgent.entity.moveTo(entity.location);
    }
    onAgentSpeech(from, speech) {
        console.log('received entity speech');
        console.log(arguments);
        let e = this.getAgent(from);
        if (!e)
            return;
        e.entity.speak(speech);
    }
    onTerminalMessage(speech) {
        console.log('>> speech sent: ', speech);
        this.socket.emit('speech', speech);
    }
    // Location based functions
    isLocation(x, y) {
        return x >= 0 && x < this.world.width && y >= 0 && y < this.world.height;
    }
    // Entity based functions
    createAgent(entity) {
        console.log('create agent', entity);
        let newEntity = new baseEntity_1.BaseEntity(entity);
        let newComponent = this.worldComponent.addEntityComponent(newEntity);
        // attach entity and component to client
        let newAgent = this.entities[entity.serial] = new agent_1.Agent(this, newEntity, newComponent);
        return newAgent;
    }
    removeEntity(serial) {
        this.worldComponent.removeEntityComponent(serial);
        return delete this.entities[serial];
    }
    getAgent(serial) {
        return this.entities[serial];
    }
}
exports.WorldModule = WorldModule;
//# sourceMappingURL=worldModule.js.map