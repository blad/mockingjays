let Colorize = {};

Colorize.red = function(text) {
  return "\u{1b}[1;31m" + text + "\u{1b}[0m";
}

Colorize.green = function(text) {
  return "\u{1b}[1;32m" + text + "\u{1b}[0m";
}

Colorize.yellow = function(text) {
  return "\u{1b}[1;33m" + text + "\u{1b}[0m";
}

Colorize.blue = function(text) {
  return "\u{1b}[1;34m" + text + "\u{1b}[0m";
}

export default Colorize;
