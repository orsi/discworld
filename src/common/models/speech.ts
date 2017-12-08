import { Entity } from './';

export class Speech {
    text: string;
    createdAt: Date;
    constructor (text: string) {
        this.text = text;
        this.createdAt = new Date();
    }
}