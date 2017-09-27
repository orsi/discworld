import { Reverie, ReverieModule } from '../reverie';

enum LEVEL {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    FATAL = 5
}
export class Logger extends ReverieModule {
    private static LEVEL = LEVEL;
    private static logLevel: LEVEL = LEVEL.DEBUG;
    constructor(public loggerName: string, reverie: Reverie, options?: any) {
        super('logger', reverie);
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

// let LogLevel;
// let output = '';

// let log = {};
// log.print = function (message, data) {
//         if (message !== '') {
//             output += message + '\n';
//             if (data) console.dir(data);
//         }
//     }
// log.trace = function (message, data) {
//         if (LogLevel >= LEVELS.TRACE) {
//             output += '\x1b[37m' + message + '\x1b[0m\n';
//             if (data) console.dir(data);
//         }
//     }
// log.debug = function (message, data) {
//         if (LogLevel >= LEVELS.DEBUG) {
//             output += '\x1b[32m' + message + '\n';
//             if (data) output += '\t' + JSON.stringify(data) + '\n';
//             output += '\x1b[0m';
//         }
//     }
// log.info = function (message, data) {
//         if (LogLevel >= LEVELS.INFO) {
//             console.log('\x1b[36m%s\x1b[0m', message);
//             if (data) console.dir(data);
//         }
//     }
// log.warn = function (message, data) {
//         if (LogLevel >= LEVELS.WARN) {
//             console.log('\x1b[33m%s\x1b[0m', message);
//             if (data) console.dir(data);
//         }
//     }
// log.error = function (message, data) {
//         if (LogLevel >= LEVELS.ERROR) {
//             console.log('\x1b[36m%s\x1b[0m', message);
//             if (data) console.dir(data);
//         }
//     }
// log.fatal = function (message, data) {
//         if (LogLevel >= LEVELS.FATAL) {
//             console.log('\x1b[31m%s\x1b[0m', message);
//             if (data) console.dir(data);
//         }
//     }
// log.output = function () {
//         var string = output;
//         output = '';
//         return string;
// }
// module.exports = {
//   init: function (logLevel) {
//     // set log level
//     LogLevel = logLevel || 4;

//     let level;
//     if (LogLevel >= LEVELS.FATAL) level = 'Fatal';
//     else if (LogLevel >= LEVELS.ERROR) level = 'Error';
//     else if (LogLevel >= LEVELS.WARN) level = 'Warn';
//     else if (LogLevel >= LEVELS.INFO) level = 'Info';
//     else if (LogLevel >= LEVELS.DEBUG) level = 'Debug';
//     else level = 'Trace';
//     console.log('logger set to log level ' + LogLevel + ' (' + level + ')');
//   },
//   log: log
// };