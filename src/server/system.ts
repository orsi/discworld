import Entity from './entity';

export default abstract class System {
    update (entities: Array<Entity>, delta: number): void {}
}