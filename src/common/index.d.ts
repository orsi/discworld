interface Dictionary<T> {
    [key: string]: T;
}

/** hack for updating to new Web Components v1 Standard */
interface EventInit {
    scoped?: boolean;
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
}