import { BaseEntity } from '../common/entities/baseEntity';
import { uuid } from '../common/utils';
import { WorldModule } from './worldModule';
import { EntityComponent } from './components';

export class Agent {
    serial: string;
    entity: BaseEntity;
    component: EntityComponent;
    world: WorldModule;
    constructor (world: WorldModule, entity: BaseEntity, component: EntityComponent) {
        this.serial = uuid();
        this.world = world;
        this.entity = entity;
        this.component = component;
    }
}