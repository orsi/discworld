import { WorldLocation, Skill, Speech } from './';
import { EntityTypes } from '../data/entityTypes';

export class Entity {
    serial: string;
    type: EntityTypes;
    location: WorldLocation;
    speech: Speech[];
    name: string;
    health: number;
    mana: number;
    stamina: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    createdAt: Date;
    deletedAt: Date;
    elapsedTime: number;
    constructor () {
        this.createdAt = new Date();
    }
}