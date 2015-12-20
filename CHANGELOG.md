# Change log

## v1.8.0 (12/20/2015)

- Add `serve` and `rehash` subcommands to the CLI interface.
- End users should now use the new subcommands to specify the mode. `serve` will be the default.


## v1.7.0 (12/19/2015)

- Add `--help` and `--version` commands
- When no options are provided display the help menu.
- Add `responseHeaderBlacklist` options to provide the ability to prevent specific headers in the response from being recorded to the cache files.
- Add a new line to the end of all new cache files.
- Handle JSON exceptions when content-type was `application/json`, but payload was not actually JSON.
