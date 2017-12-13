export class Speech {
    serial: string;
    text: string;
    createdAt: Date;
    constructor (text: string) {
        this.text = text;
        this.createdAt = new Date();
    }
}