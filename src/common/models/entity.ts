import { WorldLocation } from './';
import { Skill } from './skill';

export class Entity {
    serial: string;
    type: string;
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