import Entity from './Entity';

export default abstract class System {
    update (entities: Array<Entity>, delta: number): void {}
}