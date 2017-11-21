import { EntityType } from './entityType';
import { Skill } from './skill';

export class Entity {
    id: number;
    serial: string;
    health: number;
    mana: number;
    stamina: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    name: string;
    x: number;
    y: number;
    z: number;
    type: EntityType;
    skills: Skill[];
}