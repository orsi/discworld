"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimerManager {
    constructor() {
        this.timers = [];
    }
    process(delta) {
        for (let i = 0; i < this.timers.length; i++) {
            const timer = this.timers[i];
            if (timer.isActive)
                timer.tick(delta);
            else
                this.timers.splice(i, 1);
        }
    }
    createTimer(tickTime, callback, isOnce = false) {
        let timer = new Timer(tickTime, callback, isOnce);
        timer.id = this.timers.length;
        this.timers.push(timer);
        return timer.id;
    }
    remove(i) {
        if (this.timers.length - 1 > i) {
            this.timers.splice(i, 1);
        }
    }
    removeAll() {
        this.timers.splice(0, this.timers.length);
    }
}
exports.TimerManager = TimerManager;
class Timer {
    constructor(tickTime, callback, isOnce = false) {
        this.isActive = true;
        this.createdAt = new Date();
        this.lastTickTime = this.createdAt.getTime();
        this.totalTime = 0;
        this.tickTime = 0;
        this.timeUntilNextTick = 0;
        this.cycles = 0;
        this.isOnce = false;
        this.tickTime = tickTime;
        this.callback = callback;
        this.timeUntilNextTick = tickTime;
        this.isOnce = isOnce;
    }
    tick(elapsedTime) {
        this.totalTime += elapsedTime;
        this.timeUntilNextTick -= elapsedTime;
        if (this.timeUntilNextTick <= 0) {
            this.lastTickTime = new Date().getTime();
            this.callback();
            // reset timer if repeating
            if (!this.isOnce) {
                this.timeUntilNextTick = this.tickTime + this.timeUntilNextTick; // preserves overtime
                this.cycles++;
            }
            else {
                this.isActive = false;
            }
        }
    }
}
//# sourceMappingURL=timerManager.js.map