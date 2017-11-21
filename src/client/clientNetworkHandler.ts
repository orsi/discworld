import { Client } from './client';
import { ClientUI } from './clientUI';
import { Network } from './network';
import { WorldModule } from './worldModule';
import { EventChannel } from '../common/services/eventChannel';
import { World, Entity } from '../common/models';

/**
 * Manages all events between
 * the network, world, and ui.
 */
export class ClientNetworkHandler {
    client: Client;
    ui: ClientUI;
    events: EventChannel;
    network: Network;
    world: WorldModule;
    totalTime = 0;
    constructor (client: Client) {
        this.client = client;
        let events = this.events = this.client.events;
        this.ui = this.client.ui;
        this.world = this.client.world;
        this.network = new Network(events);

        // from server
        events.on('connect', (data) => console.log(data));
        events.on('client/entity', (data) => this.world.setAgentEntity(data));
        events.on('world/info', (data) => this.world.onWorldInfo(data));
        events.on('world/map', (data) => this.world.onWorldMap(data));
        events.on('world/update', (data) => this.world.updateWorld(data));
        events.on('entity/info', (data) => this.world.onEntityInfo(data));
        events.on('entity/destroy', (data) => this.world.removeEntity(data));

        // to server
        events.on('terminal/message', (data) => this.network.send('message', data));
        events.on('entity/move', (data) => this.network.send('move', data));
    }
    update (delta: number) {
        this.totalTime += delta;
    }
}