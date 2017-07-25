import { default as EventChannel, EventModule } from './eventChannel';

export default abstract class Module {
    protected EventModule: EventModule;
    constructor (moduleName: string) {
        this.EventModule = EventChannel.register(moduleName);
    }
    update (delta: number): void {}
}