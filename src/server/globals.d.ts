interface IEventChannel {
    /**
     * Invokes all registered event listeners on next
     * Reverie cycle.
     */
  emit (eventName: string, data?: any, cb?: () => void): void,
    /**
     * Registers an event listener to the global events channel
     * that is executed whenever eventName is emitted.
     */
  on (eventName: string, listener: () => void): void,
    /**
     * Invokes all registered event listeners during
     * next nodeJS event loop.
     */
  emitSync (eventName: string, data?: any, cb?: () => void): void
}
interface ReverieConfig {
    database?: any;
    universe?: any;
    network?: any;
}
interface Script {
    file: string
}
interface IEventMessage {
    eventName: string,
    data?: any,
    cb?: () => void
}