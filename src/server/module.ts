export default class Module {
    protected eventChannel: IEventChannel;
    constructor (moduleName: string, eventChannel: IEventChannel) {
        this.eventChannel = eventChannel;
    }
    update (delta: number): void {}
}