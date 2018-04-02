import Colorize from './colorize';

let Level = {
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4
};

let Logger = function() {
  this.level = Level.INFO;
  if (arguments.length > 0) {
    this.setLevel.apply(this, arguments);
  }
};


Logger.prototype.setLevel = function (logLevel) {
  switch (logLevel) {
    case 'error':
      this.level = Level.ERROR;
      break;
    case 'warn':
      this.level = Level.WARN;
      break;
    case 'info':
      this.level = Level.INFO;
      break;
    case 'debug':
      this.level = Level.DEBUG;
      break;
    default:
      console.warn('Unknown Log Level, Setting level to INFO');
      this.level = Level.INFO;
  }
}


Logger.prototype.debug = function () {
  Array.prototype.unshift.call(arguments, Level.DEBUG);
  this.log.apply(this, arguments);
}


Logger.prototype.info = function () {
  Array.prototype.unshift.call(arguments, Level.INFO);
  this.log.apply(this, arguments);
}


Logger.prototype.error = function () {
  Array.prototype.unshift.call(arguments, Level.ERROR);
  this.log.apply(this, arguments);
}


Logger.prototype.warn = function () {
  Array.prototype.unshift.call(arguments, Level.WARN);
  this.log.apply(this, arguments);
}


Logger.prototype.log = function () {
  let level = arguments[0];
  let messages = Array.prototype.slice.call(arguments, 1);
  if (messages.length == 1 && messages[0] === 'false') {
    return;
  }
  if (level <= this.level) {
    switch (level) {
      case Level.ERROR:
        console.error(Colorize.red('ERROR:    '), this.formatLines(messages).join(' '));
        break;
      case Level.WARN:
        console.warn(Colorize.yellow('WARN:     '), this.formatLines(messages).join(' '));
        break;
      case Level.DEBUG:
        console.warn(Colorize.blue('DEBUG:    '), this.formatLines(messages).join(' '));
        break;
      case Level.INFO:
        console.log(Colorize.blue('INFO:     '), this.formatLines(messages).join(' '));
        break;
    }
  }
}

Logger.prototype.formatLines = function (lines) {
  let newLines = [];
  for (let index = 0; index < lines.length; index++) {
    let multiline = lines[index].toString().split('\n');
    for (let subindex = 0; subindex < multiline.length; subindex++) {
      let prefix = subindex == 0 ? '' : '          ';
      let suffix = multiline.length > 1 ? '\n' : '';
      newLines.push(prefix + multiline[subindex] + suffix);
    }
  }
  return newLines;
}

export default Logger;
