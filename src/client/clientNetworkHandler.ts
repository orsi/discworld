import { Client } from './client';
import { ClientUI } from './clientUI';
import { Network } from './network';
import { World } from './world';
import { EventManager } from '../common/eventManager';
import { WorldModel } from '../common/world/models/worldModel';
import { Entity } from '../common/ecs/entity';

/**
 * Manages all events between
 * the network, world, and ui.
 */
export class ClientNetworkHandler {
    client: Client;
    ui: ClientUI;
    events: EventManager;
    network: Network;
    world: World;
    totalTime = 0;
    constructor (client: Client) {
        this.client = client;
        let events = this.events = this.client.events;
        this.ui = this.client.ui;
        this.world = this.client.world;
        this.network = new Network(events);

        events.registerEvent('terminal/message', (message: string) => this.onTerminalMessage(message));
        events.registerEvent('server', (data) => this.onServer(data));
        events.registerEvent('server/update', (data) => this.onServerUpdate(data));
        events.registerEvent('agent', (entitySerial: string) => this.onAgentEntity(entitySerial));
        events.registerEvent('world', (data: WorldModel) => this.onWorld(data));
        events.registerEvent('world/update', (data: WorldModel) => this.onWorldUpdate(data));
        events.registerEvent('entity', (data: Entity) => this.onEntity(data));
        events.registerEvent('entity/update', (data: Entity) => this.onEntityUpdate(data));
        events.registerEvent('entity/destroy', (data: string) => this.onEntityDestroy(data));
        events.registerEvent('entity/move', (data: string) => this.onEntityMove(data));
        events.registerEvent('tile', (data) => this.onTile(data));
        events.registerEvent('tile/update', (data) => this.onTileUpdate(data));
    }

    update (delta: number) {
        this.totalTime += delta;
    }

    onTerminalMessage (message: string) {
        this.network.send('entity/message', message);
    }
    onServer (data: any) {
        console.log(data);
    }
    onServerUpdate (data: any) {
        console.log(data);
    }
    onAgentEntity (entitySerial: string) {
        console.log(entitySerial);
        this.world.setAgentEntity(entitySerial);
    }
    onWorld (world: WorldModel) {
        this.world.loadWorld(world);
    }
    onWorldUpdate (world: WorldModel) {
        this.world.updateWorld(world);
    }
    onEntity (entity: Entity) {
        this.world.addEntity(entity);
    }
    onEntityUpdate (entity: Entity) {
        this.world.updateEntity(entity);
    }
    onEntityDestroy (entitySerial: string) {
        this.world.removeEntity(entitySerial);
    }
    onEntityMove (direction: string) {
        this.network.send('entity/move', direction);
    }
    onTile (data: any) {
        this.world.loadTile(data);
    }
    onTileUpdate (data: any) {
        this.world.updateTile(data);
    }
}