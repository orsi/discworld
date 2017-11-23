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
    x: number;
    y: number;
    z: number;
    constructor () {}
}