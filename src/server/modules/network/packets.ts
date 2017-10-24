import { Client } from '../client';

export interface EntityConnect { }
export class ClientMessage {
    constructor(public client: Client, public message: string) {}
}
export interface EntityMove {}
