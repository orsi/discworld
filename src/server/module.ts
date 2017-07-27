import { default as EventChannel, EventModule } from './eventChannel';

export default abstract class Module {
    protected EventModule: EventModule;
    constructor (public name: string) {}
    update (delta: number): void {}
}