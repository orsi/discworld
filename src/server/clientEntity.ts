import { Entity, Speech } from '../common/models';
import { WorldSystem } from './worldSystem';
import { Client } from './client';

export class ClientEntity {
    entity: Entity;
    constructor (
        public world: WorldSystem,
        public client: Client
    ) {
        this.entity = new Entity();
    }
    update (delta: number) {}
}