
enum LEVEL {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    FATAL = 5
}
export class Logger  {
    private static LEVEL = LEVEL;
    private static logLevel: LEVEL = LEVEL.DEBUG;
    constructor(public loggerName: string, options?: any) {
    }
    static log (level: LEVEL) {
        const logLevel = this.logLevel; // for access inside descriptor

        return function (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
            const originalMethod = descriptor.value;

            descriptor.value = function (...args: any[]) {
                if (level < logLevel) {
                    console.log(`${key} called with args: ${JSON.stringify(args)}`);
                    const result = originalMethod.apply(this, args);
                    console.log(`${key} returned with result: ${JSON.stringify(result)}`);
                }
            };
        };
    }
    static configure(level: LEVEL) {
    }
    update() {}
}