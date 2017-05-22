var LogLevels = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5
}
var LoggerLevel;
var lines = '';

module.exports = {
  init: function (logLevel) {
    // set log level
    LoggerLevel = logLevel || 4;

    var logType;
    if (LoggerLevel >= LogLevels.FATAL) logType = 'Fatal';
    else if (LoggerLevel >= LogLevels.ERROR) logType = 'Error';
    else if (LoggerLevel >= LogLevels.WARN) logType = 'Warn';
    else if (LoggerLevel >= LogLevels.INFO) logType = 'Info';
    else if (LoggerLevel >= LogLevels.DEBUG) logType = 'Debug';
    else logType = 'Trace';
    console.log('logger set to log level ' + LoggerLevel + ' (' + logType + ')');
  },
  log: {
    print: function (message, data) {
      if (message !== '') {
        lines += message + '\n';
        if (data) console.dir(data);
      }
    },
    trace: function (message, data) {
      if (LoggerLevel >= LogLevels.TRACE) {
        lines += '\x1b[37m' + message + '\x1b[0m\n';
        if (data) console.dir(data);
      }
    },
    debug: function (message, data) {
      if (LoggerLevel >= LogLevels.DEBUG) {
        lines += '\x1b[32m' + message + '\n';
        if (data) lines += '\t' + JSON.stringify(data) + '\n';
        lines += '\x1b[0m';
      }
    },
    info: function (message, data) {
      if (LoggerLevel >= LogLevels.INFO) {
        console.log('\x1b[36m%s\x1b[0m', message);
        if (data) console.dir(data);
      }
    },
    warn: function (message, data) {
      if (LoggerLevel >= LogLevels.WARN) {
        console.log('\x1b[33m%s\x1b[0m', message);
        if (data) console.dir(data);
      }
    },
    error: function (message, data) {
      if (LoggerLevel >= LogLevels.ERROR) {
        console.log('\x1b[36m%s\x1b[0m', message);
        if (data) console.dir(data);
      }
    },
    fatal: function (message, data) {
      if (LoggerLevel >= LogLevels.FATAL) {
        console.log('\x1b[31m%s\x1b[0m', message);
        if (data) console.dir(data);
      }
    }
  },
  output: function () {
    var out = lines;
    lines = '';
    return out;
  }
}