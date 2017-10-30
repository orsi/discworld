import { WorldModel } from './models/worldModel';

export class WorldEvent {
    constructor () {}
}
export class Created extends WorldEvent {
    constructor (public model: WorldModel) {
        super();
    }
}
export class Updated extends WorldEvent {
    constructor (public model: WorldModel) {
        super();
    }
}
export class Destroyed extends WorldEvent {
    constructor (public model: WorldModel) {
        super();
    }
}