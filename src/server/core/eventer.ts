export class Eventer {
  private channels: {[key: string]: ((...params: any[]) => void)[] } = {};
  constructor (public eventerName: string) {}
  emit (eventName: string, ...params: any[]): void {
    console.log('emitted: ', eventName, ...params);
    if (this.channels[eventName]) {
      this.channels[eventName].forEach(listener => {
        listener(params);
      });
    }
  }
  on (eventName: string, listener: (...params: any[]) => void) {
    this.channels[eventName].push(listener);
  }
  /**
   * Processes all event handlers currently waiting in each
   * event channel's queue
   */
  process() {}
}
