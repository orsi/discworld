import { Entity, EntitySpeech, WorldLocation } from '../models';

export class BaseEntity {
    _model: Entity;
    get model () { return this._model; }
    _serial: string;
    get serial () { return this._serial; }
    set serial (serial: string) {
        this._serial = this._model.serial = serial;
    }
    _type: string;
    get type () { return this._type; }
    set type (type: string) {
        this._type = this._model.type = type;
    }
    _name: string;
    get name () { return this._name; }
    set name (name: string) {
        this._name = this._model.name = name;
    }
    _health: number;
    get health () { return this._health; }
    set health (health: number) {
        this._health = this._model.health = health;
    }
    _mana: number;
    get mana () { return this._mana; }
    set mana (number: number) {
        this._mana = this._model.mana = number;
    }
    _stamina: number;
    get stamina () { return this._stamina; }
    set stamina (stamina: number) {
        this._stamina = this._model.stamina = stamina;
    }
    _strength: number;
    get strength () { return this._strength; }
    set strength (strength: number) {
        this._strength = this._model.strength = strength;
    }
    _dexterity: number;
    get dexterity () { return this._dexterity; }
    set dexterity (dexterity: number) {
        this._dexterity = this._model.dexterity = dexterity;
    }
    _intelligence: number;
    get intelligence () { return this._intelligence; }
    set intelligence (intelligence: number) {
        this._intelligence = this._model.intelligence = intelligence;
    }
    _location: WorldLocation;
    get location () { return this._location; }
    set location (location: WorldLocation) {
        this._location = this._model.location = location;
    }
    currentSpeech: EntitySpeech | void;
    speech: EntitySpeech[] = [];
    totalTime = 0;
    constructor (model: Entity) {
        this._model = model;
        this.serial = model.serial;
        this.name = model.name;
        this.type = model.type;
        this.health = model.health;
        this.mana = model.mana;
        this.stamina = model.stamina;
        this.strength = model.strength;
        this.dexterity = model.dexterity;
        this.intelligence = model.intelligence;
        this.location = model.location;
    }
    update (delta: number) {
        this.totalTime += delta;
        if (this.currentSpeech
            && this.totalTime - this.currentSpeech.createdAt.getTime() > 5000) this.currentSpeech = undefined;
    }
    moveTo (location: WorldLocation) {
        this.location = location;
    }
    speak (speech: string) {
        let newSpeech = new EntitySpeech();
        newSpeech.text = speech;
        this.currentSpeech = newSpeech;
        this.speech.push(newSpeech);
    }
}