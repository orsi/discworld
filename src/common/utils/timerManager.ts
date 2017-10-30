export class TimerManager {
    timers: Timer[] = [];
    process (delta: number) {
        for (let i = 0; i < this.timers.length; i++) {
            const timer = this.timers[i];
            if (timer.isActive) timer.tick(delta);
            else this.timers.splice(i, 1);
          }
    }
    createTimer(tickTime: number, callback: () => void, isOnce: boolean = false) {
        let timer = new Timer(tickTime, callback, isOnce);
        timer.id = this.timers.length;
        this.timers.push(timer);
        return timer.id;
    }
    remove (i: number) {
        if (this.timers.length - 1 > i) {
            this.timers.splice(i, 1);
        }
    }
    removeAll () {
        this.timers.splice(0, this.timers.length);
    }
}
class Timer {
    id: number;
    isActive = true;
    createdAt = new Date();
    lastTickTime = this.createdAt.getTime();
    totalTime = 0;
    private tickTime = 0;
    private timeUntilNextTick = 0;
    private cycles = 0;
    private isOnce = false;
    private callback: () => void;
    constructor(tickTime: number, callback: () => void, isOnce: boolean = false) {
        this.tickTime = tickTime;
        this.callback = callback;
        this.timeUntilNextTick = tickTime;
        this.isOnce = isOnce;
    }
    tick(elapsedTime: number) {
        this.totalTime += elapsedTime;
        this.timeUntilNextTick -= elapsedTime;
        if (this.timeUntilNextTick <= 0) {
            this.lastTickTime = new Date().getTime();
            this.callback();
            // reset timer if repeating
            if (!this.isOnce) {
                this.timeUntilNextTick = this.tickTime + this.timeUntilNextTick; // preserves overtime
                this.cycles++;
            } else {
                this.isActive = false;
            }
        }
    }
}