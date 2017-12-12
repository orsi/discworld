"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entityManager_1 = require("./world/entityManager");
const models_1 = require("../common/models");
const mapManager_1 = require("./world/mapManager");
const client_1 = require("./client");
class WorldModule {
    constructor(reverie) {
        this.regions = [];
        this.clients = {};
        // Update properties
        this.startTime = new Date();
        this.lastUpdateTime = this.startTime.getTime();
        this.lastUpdatedEventTime = this.startTime.getTime();
        this.pauseStartTime = this.startTime.getTime();
        this.worldTime = this.startTime.getTime();
        this.cycles = 0;
        this.isUpdating = false;
        this.isPaused = false;
        const events = this.events = reverie.events;
        this.entities = new entityManager_1.EntityManager(this);
        this.maps = new mapManager_1.MapManager(this);
        // from network
        events.on('connection', (data) => this.onClientConnection(data));
    }
    update(delta) {
        this.cycles++;
        this.worldTime += delta;
        this.lastUpdateTime = this.worldTime;
        // main update
        this.entities.update(delta);
    }
    destroy() {
        this.model = undefined;
    }
    // Eventing Routes
    onCreate(seed = 'reverie') {
        // get entity
        // get current world
        // if entity can create world, and world doesn't exist, create world
        // if entity can't, or world exists, reject
        this.model = new models_1.World();
        this.model.seed = seed;
        this.model.width = 192;
        this.model.height = 192;
        this.maps.createMap(this.model);
        this.model.state = models_1.WorldState.SIMULATING;
        // give all clients an entity and send info
        for (let serial in this.clients) {
            let client = this.clients[serial];
            // create entity for client
            let entity = this.entities.create();
            client.entity = entity;
            // find location for client
            let x = 5;
            let y = 5;
            let location = this.maps.getLocation(x, y);
            client.entity.moveTo(location);
            client.send('client/entity', client.entity);
        }
        // all clients have a position, now send region data
        for (let serial in this.clients) {
            let client = this.clients[serial];
            // send new world
            client.send('world/info', this.model);
            // send region to client
            let map = this.maps.getRegionAt(client.entity.location.x, client.entity.location.y);
            map.forEach(x => {
                x.forEach(location => client.send('world/location', location));
            });
            // send other entities in range
            for (let serial in this.clients) {
                let c = this.clients[serial];
                if (this.maps.isLocationInRegion(c.entity.location, client.entity.location))
                    client.send('entity/move', c.entity);
            }
        }
    }
    onClientConnection(socket) {
        // new client has connected to world
        // create entity for client
        // return entity information for client
        // find location of entity, send world data in view
        // check if other entities are in view, send entities
        let client = new client_1.Client(socket, this);
        this.clients[client.serial] = client;
        if (!this.model)
            return;
        // world exists, create entity for client
        client.send('world/info', this.model);
        let entity = client.entity = this.entities.create();
        let x = 5;
        let y = 5;
        let location = this.maps.getLocation(x, y);
        entity.moveTo(location);
        client.send('client/entity', client.entity);
        let map = this.maps.getRegionAt(x, y);
        map.forEach(x => {
            x.forEach(location => client.send('world/location', location));
        });
        // send new entity to clients in range
        for (let serial in this.clients) {
            let c = this.clients[serial];
            if (this.maps.isLocationInRegion(location, c.entity.location))
                c.send('entity/move', client.entity);
        }
    }
    onEntityDisconnect(client) {
        if (!this.model)
            return;
        // send remove entity to clients in region
        for (let serial in this.clients) {
            let c = this.clients[serial];
            if (this.maps.isLocationInRegion(client.entity.location, c.entity.location))
                c.send('entity/remove', client.entity.serial);
        }
        // remove entity/client
        this.entities.remove(client.entity.serial);
        delete this.clients[client.entity.serial];
    }
    onClientSpeech(client, speech) {
        console.log(speech);
        // get entity
        // check if entity can perform action
        switch (speech) {
            case '/generate':
                this.onCreate();
                break;
            case '/destroy':
                this.destroy();
                break;
            default:
                if (!client.entity)
                    return;
                client.entity.speak(speech);
                // send speech to all clients in region
                for (let serial in this.clients) {
                    let to = this.clients[serial];
                    if (this.maps.isLocationInRegion(to.entity.location, client.entity.location)) {
                        to.send('entity/speech', client.entity.serial, speech);
                        console.log(`sent entity/speech '${speech}' to ${to.serial}`);
                    }
                }
                break;
        }
    }
    parsePosition(x, y, direction) {
        if (direction.indexOf('n') > -1)
            y--;
        if (direction.indexOf('s') > -1)
            y++;
        if (direction.indexOf('e') > -1)
            x++;
        if (direction.indexOf('w') > -1)
            x--;
        return {
            x: x,
            y: y
        };
    }
    onEntityMove(client, data) {
        // get entity current location
        // get request world location they wish to move to
        // check if entity can move to location
        // if they can, move entity to location
        // if they can't, reject movement
        if (!this.model)
            return;
        let newLocation = this.parsePosition(client.entity.location.x, client.entity.location.y, data);
        let location = this.maps.getLocation(newLocation.x, newLocation.y);
        if (!this.maps.canTravelToLocation(location))
            return;
        client.entity.moveTo(location);
        let map = this.maps.getRegionAt(newLocation.x, newLocation.y);
        map.forEach(x => {
            x.forEach(location => client.send('world/location', location));
        });
        // send client location to clients in range
        for (let serial in this.clients) {
            let to = this.clients[serial];
            if (this.maps.isLocationInRegion(to.entity.location, client.entity.location))
                to.send('entity/move', client.entity);
        }
    }
    onEntityAction(sEntity, data) {
        // get entity
        // check if entity can perform action
    }
    onEntityInteract(sEntity, data) {
        // get entity
        // get object entity wants to interact with
        // check if entity cna interact with it
        // if entity can, perform interaction with object
        // if entity can't, reject
    }
    onEntityFocus(sEntity, data) {
        // get entity
        // get object entity wants to focus
        // check if entity can focus on object
        // return information if entity can focus on it
    }
}
exports.WorldModule = WorldModule;
//# sourceMappingURL=worldModule.js.map