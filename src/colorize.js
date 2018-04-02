let Colorize = {};

Colorize.red = function(text) {
  return "\\033[1;31m" + text + "\\033[0m";
}

Colorize.green = function(text) {
  return "\\033[1;32m" + text + "\\033[0m";
}

Colorize.yellow = function(text) {
  return "\\033[1;33m" + text + "\\033[0m";
}

Colorize.blue = function(text) {
  return "\\033[1;34m" + text + "\\033[0m";
}

export default Colorize;
