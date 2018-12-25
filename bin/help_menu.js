let HelpMenu = function () {
  let helpDescription = [
    '',
    'Usage:',
    '  mockingjays <command> [options]',
    '',
    'Commands:',
    '  serve                       Start the Mockingjays Proxy Server',
    '  rehash                      Process all the cached files with a new set of options.',
    '                              Rehashing will compute a new hash if any headers should be ignored. Rehashing will',
    '                              also apply new rules to the stored responses.',
    '',
    'Options:',
    '  --cacheDir                  Directory where request/response data should be stored. \u{1b}[1;31mREQUIRED\u{1b}[0m',
    '  --serverBaseUrl             Place where an unseen request can be learned. \u{1b}[1;31mREQUIRED\u{1b}[0m',
    '  --port                      Port that the proxy server should bind to. \u{1b}[1;33mDefault: 9000\u{1b}[0m',
    '  --ignoreContentType         Comma separated list of content-types that should not be cached. \u{1b}[1;33mDefault: \'\'\u{1b}[0m',
    '  --refresh                   Indicates if the cache should be updated unconditionally. \u{1b}[1;33mDefault: false\u{1b}[0m',
    '  --cacheHeaders              Headers that should be considered as part of the cache signature. \u{1b}[1;33mDefault: \'\'\u{1b}[0m',
    '  --queryParameterBlacklist   Comma separated list of query parameters that should not be cached. \u{1b}[1;33mDefault: \'\'\u{1b}[0m',
    '  --readOnly                  Disable writing new cache fixtures. \u{1b}[1;33mDefault: false\u{1b}[0m',
    '  --responseHeaderBlacklist   Indicates headers that should not be recorded to the cache file. \u{1b}[1;33mDefault: \'\'\u{1b}[0m',
    '  --help                      Displays this description of options',
    '  --version                   Displays version information',
    ''
  ];

  // eslint-disable-next-line no-console
  console.log(helpDescription.join('\n'));
};

export default HelpMenu;
