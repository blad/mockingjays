# Change log

## v1.15.0 (7/5/2016)

- Add `whiteLabel` to exclude hostname and port from hash

## v1.14.0 & v1.14.1 (6/21/2016)

- Bug Fix: CORS Forward `Origin` header
- Add `passthrough` option to allow proxy to forward request without refreshing the fixtures

## v1.10.2 (12/26/2015)

- Bug Fix: Account for Key Ordering when Rehashing Existing Responses with Transaction Key
- Bug Fix: Add Transaction Key when Rehashing Pre-Existing Responses

## v1.10.1 (12/26/2015)

- Remove Leftover Debugging Log Statement

## v1.10.0 (12/26/2015)

- Add support for defining a transition configuration to track stateful requests.
- Add Support for Integration Tests to Repository
- Add LogLevel Flag to specify log levels.
- Gracefully Handle HTTP Client Errors.

## v1.9.0 (12/24/2015)

- Bug Fix: Correctly Remove Old Files When Rehashing
- Bug Fix: Correctly Detect Port When Rehashing

## v1.8.0 (12/20/2015)

- Add `serve` and `rehash` subcommands to the CLI interface.
- End users should now use the new subcommands to specify the mode. `serve` will be the default.


## v1.7.0 (12/19/2015)

- Add `--help` and `--version` commands
- When no options are provided display the help menu.
- Add `responseHeaderBlacklist` options to provide the ability to prevent specific headers in the response from being recorded to the cache files.
- Add a new line to the end of all new cache files.
- Handle JSON exceptions when content-type was `application/json`, but payload was not actually JSON.
