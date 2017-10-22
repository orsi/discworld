export class Eventer {
  private queue: {} = [];
  private channels: {[key: string]: ((...params: any[]) => void)[] } = {};
  constructor (public eventerName: string) {}
  emit (eventName: string, ...args: any[]): void {
    console.log('emitted: ', eventName);
    if (this.channels[eventName]) {
      this.channels[eventName].forEach(listener => {
        listener(...args);
      });
    }
  }
  on (eventName: string, listener: (...params: any[]) => void) {
    console.log('registered handler', eventName, listener);
    if (!this.channels[eventName]) this.channels[eventName] = [];
    this.channels[eventName].push(listener);
  }
  /**
   * Processes all event handlers currently waiting in each
   * event channel's queue
   */
  process() {}
  /**
   * Prints out current event handlers
   */
  print() {
    console.dir(this.channels);
  }
}
