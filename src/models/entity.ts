import Speech from './speech';
import { ENTITIES } from '../data/static/entities';

export default class Entity {
    serial: string;
    type: ENTITIES;
    x: number;
    y: number;
    z: number;
    createdAt: number;
    speech: Speech[] = [];
    name: string;
    health: number;
    mana: number;
    stamina: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    deletedAt: number;
    constructor () {}
}