import { WorldModel } from './models/worldModel';

export class WorldEvent {
    constructor () {}
}
export class Create extends WorldEvent {
    constructor (public model: WorldModel) {
        super();
    }
}
export class Update extends WorldEvent {
    constructor (public model: WorldModel) {
        super();
    }
}
export class Destroy extends WorldEvent {
    constructor (public model: WorldModel) {
        super();
    }
}