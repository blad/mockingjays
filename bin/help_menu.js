var HelpMenu = function() {
  var helpDescription = [
    '',
    'Usage:',
    '  mockingjays [options]',
    '',
    'Options:',
    '  --cacheDir                  Directory where request/response data should be stored. \033[1;31mREQUIRED\033[0m',
    '  --serverBaseUrl             Place where an unseen request can be learned. \033[1;31mREQUIRED\033[0m',
    '  --port                      Port that the proxy server should bind to. \033[1;33mDefault: 9000\033[0m',
    '  --ignoreContentType         Comma separated list of content-types that should not be cached. \033[1;33mDefault: \'\'\033[0m',
    '  --refresh                   Indicates if the cache should be updated unconditionally. \033[1;33mDefault: false\033[0m',
    '  --cacheHeaders              Headers that should be considered as part of the cache signature. \033[1;33mDefault: \'\'\033[0m',
    '  --responseHeaderBlacklist   Indicates headers that should not be recorded to the cache file. \033[1;33mDefault: \'\'\033[0m',
    '  --help                      Displays this description of options',
    '  --version                   Displays version information',
    ''
  ];

  console.log(helpDescription.join("\n"));
}

module.exports = HelpMenu
