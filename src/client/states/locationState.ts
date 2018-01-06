import { Client } from '../client';
import { State } from './state';

export class LocationState extends State {
    constructor (public client: Client) {
        super(client);
    }
    pause () {}
    resume () {}
    update (delta: number) {}
    render (interpolation: number) {}
    dispose () {}
}