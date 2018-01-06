import { Client } from '../client';

export class State {
    constructor (public client: Client) {}
    pause () {}
    resume () {}
    update (delta: number) {}
    render (interpolation: number) {}
    dispose () {}
}