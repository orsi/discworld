import { uuid } from '../../common/utils/uuid';
import {
    Entity,
    EntityType,
    Skill,
    WorldLocation
} from '../models';

export class EntityController {
    id: number;
    serial: string;
    type: string;
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
    skills: Skill[];
    constructor(serial: string) {
        this.serial = serial;
    }
}