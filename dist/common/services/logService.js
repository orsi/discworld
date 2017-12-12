"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LEVEL;
(function (LEVEL) {
    LEVEL[LEVEL["TRACE"] = 0] = "TRACE";
    LEVEL[LEVEL["DEBUG"] = 1] = "DEBUG";
    LEVEL[LEVEL["INFO"] = 2] = "INFO";
    LEVEL[LEVEL["WARN"] = 3] = "WARN";
    LEVEL[LEVEL["ERROR"] = 4] = "ERROR";
    LEVEL[LEVEL["FATAL"] = 5] = "FATAL";
})(LEVEL || (LEVEL = {}));
class Logger {
    constructor(loggerName, options) {
        this.loggerName = loggerName;
    }
    static log(level) {
        const logLevel = this.logLevel; // for access inside descriptor
        return function (target, key, descriptor) {
            const originalMethod = descriptor.value;
            descriptor.value = function (...args) {
                if (level < logLevel) {
                    console.log(`${key} called with args: ${JSON.stringify(args)}`);
                    const result = originalMethod.apply(this, args);
                    console.log(`${key} returned with result: ${JSON.stringify(result)}`);
                }
            };
        };
    }
    static configure(level) {
    }
    update() { }
}
Logger.LEVEL = LEVEL;
Logger.logLevel = LEVEL.DEBUG;
exports.Logger = Logger;
//# sourceMappingURL=logService.js.map