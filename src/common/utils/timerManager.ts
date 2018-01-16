let timers: Timer[] = [];
export function process (delta: number) {
    for (let i = 0; i < timers.length; i++) {
        const timer = timers[i];
        if (timer.isActive) timer.tick(delta);
        else timers.splice(i, 1);
        }
}
export function create(tickTime: number, callback: () => void, isOnce: boolean = false) {
    let timer = new Timer(tickTime, callback, isOnce);
    timer.id = timers.length;
    timers.push(timer);
    return timer.id;
}
export function remove (i: number) {
    if (timers.length - 1 > i) {
        timers.splice(i, 1);
    }
}
export function removeAll () {
    timers.splice(0, timers.length);
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
        tickTime = tickTime;
        callback = callback;
        this.timeUntilNextTick = tickTime;
        isOnce = isOnce;
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