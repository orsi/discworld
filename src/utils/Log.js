const ALL = 0;
const WARNING = 1;
const NONE = 2;

let console_level = NONE;
let Log = new class {
  setLevel(level) {
    switch (level) {
      case 'debug':
        console_level = ALL;
        break;
    }
  }
}
module.exports = Log;
