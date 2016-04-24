var Color = require('./colorize');
Level = {
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4
};

var Logger = function() {
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
  var level = arguments[0];
  var messages = Array.prototype.slice.call(arguments, 1);
  if (messages.length == 1 && messages[0] === 'false') {
    return;
  }
  if (level <= this.level) {
    switch (level) {
      case Level.ERROR:
        console.error(Color.red('ERROR:    '), this.formatLines(messages).join(' '));
        break;
      case Level.WARN:
        console.warn(Color.yellow('WARN:     '), this.formatLines(messages).join(' '));
        break;
      case Level.DEBUG:
        console.warn('DEBUG:    ', this.formatLines(messages).join(' '));
        break;
      case Level.INFO:
        console.log('INFO:     ', this.formatLines(messages).join(' '));
        break;
    }
  }
}

Logger.prototype.formatLines = function (lines) {
  var newLines = [];
  for (var index = 0; index < lines.length; index++) {
    var multiline = lines[index].toString().split('\n');
    for (var subindex = 0; subindex < multiline.length; subindex++) {
      var prefix = subindex == 0 ? '' : '          ';
      var suffix = multiline.length > 1 ? '\n' : '';
      newLines.push(prefix + multiline[subindex] + suffix);
    }
  }
  return newLines;
}

module.exports = Logger
