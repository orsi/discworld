import { WorldLocation } from './';
import { EntityType } from './entityType';
import { Skill } from './skill';

export class Entity {
    serial: string;
    type: EntityType;
    name: string;
    health: number;
    mana: number;
    stamina: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    location: WorldLocation;
    constructor () {}
}