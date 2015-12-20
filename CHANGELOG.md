# Change log

## v1.7.0

- Add `responseHeaderBlacklist` options to provide the ability to prevent specific headers in the response from being recorded to the cache files.
- Add a new line to the end of all new cache files.
- Handle JSON exceptions when content-type was `application/json`, but payload was not actually JSON.
