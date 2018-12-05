Mockingjays
========================

[![Circle CI Build Status](https://circleci.com/gh/blad/mockingjays.png?circle-token=a4bd29bc70058220eb8e663e848ff4448231d79a)](https://circleci.com/gh/blad/mockingjays)
[![npm version](https://badge.fury.io/js/mockingjays.svg)](https://www.npmjs.com/package/mockingjays)
[![Gitter](https://badges.gitter.im/blad/mockingjays.svg)](https://gitter.im/blad/mockingjays?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

*Mockingjays* is a proxying tool that responds to requests with responses that have been previously observed.

<center>
![Mockingjays](http://www.mockingjays.io/dist/images/mockingjays-logo.png)
</center>

*Mockingjays* acts as a mock server for previously seen requests and captures new request for future use.

## Install Mockingjays
```bash
npm install -g mockingjays
```

## CLI Use
```bash
mockingjays serve\
  --cacheDir=/var/app/fixtures \ # Required
  --serverBaseUrl='http://swapi.co' \ # Required
  --cacheHeader='authorization,content-length'
  --ignoreContentType='image/*,text/html' \
  --port=9000 \
  --refresh=true \
```

### Subcommands

There are two subcommands that will indicate to Mockingjays what should be done.
These modes are `serve` and `rehash`.

`serve` starts up the proxy server that observes and responds to requests.

`rehash` is a process in which the provided options will be parsed, and then applied
to the existing cache. The `rehash` command is useful for updating the url of the
source server, removing headers from the response and request data.

## Programatic API
```javascript
var Mockingjays = require('../mockingjays')
new Mockingjays().start({
  cacheDir: '/var/app/fixtures', // Required
  serverBaseUrl: 'http://swapi.co', // Required
  cacheHeader: 'authorization,content-length',
  ignoreContentType: 'image/*,text/html',
  port: 9000,
  refresh: true
});
```

## Options

- **serverBaseUrl** -Place where an unseen request can be learned.   
  - ***Required***
- **cacheDir** - Directory where request/response data should be stored.
  - ***Required***
- **cacheHeader** - Headers that should be considered as part of the cache signature. By default all headers are ignored in the cache signature.
  - *Default: ''*
- **logLevel** - The Level of Logging information that should be displayed to the console.
  - The available options are ranked from least info to most info:
    * `none` - Nothing is logged.
    * `error` - Only errors are logged.
    * `warn` - Errors and warnings are logged.
    * `info` - Errors, warnings, and info are logged.
    * `debug` - Everything is logged.
  - *Default: info*
- **port** - Port that the proxy server should bind to.
  - *Default: 9000*
- **ignoreContentType** - Comma separated list of content-types that should be skipped. This can include a `*` which will be a wildcard match equivalent to the `.*` RegEx. No File Types Ignored by default.
  - *Default: []*
- **refresh** - Indicates if the request/response cache should be updated unconditionally.
  - *Default: false*
- **passthrough** - Indicates if the request/response cache should be ignored. Each request will passthrough the proxy, but not read/write to any cache files.
  - *Default: false*
- **responseHeaderBlacklist** - Indicates headers that should not be recorded to the cache file. Things like date or fields that may change the file during refreshes are ideal candidates.
  - *Default: []* (Record all headers)
- **transitionConfig** - Path or Object to the transition config Object. The transition config defined a mapping between requests that cause state changes, and the requests that are affected. [See Feature File for Example](features/stateful_requests.feature)
  - *Default: {}* (Consider All Operations Non-Stateful)
- **whiteLabel** - When set to true, the hostname and port number are not included as part of the request hash.
  - *Default: false* (Consider hostname and port for cache)
- *ignoreJsonBodyPath* - The path of a JSON request body to ignore in uniqueness signature. By default no paths will be ignored. eg: `a.b.c` to ignore property `c` inside nested objects `a` and `b`.
  - CLI: Comma separated list of paths to ignore.
  - JS: Use Array of paths to ignore.

## Cached Responses

The root of cached responses specified by the `cacheDir` option. Each response
is then stored in a subdirectory that matches the path for the request.

For example, a request to the path: `/api/` when the `cacheDir` option has the value of `/var/app/fixtures`
will be stored in `/var/app/fixtures/api/{sha1_request_hash}` where `sha1_request_hash` is a
hash value of the http request.

Request with deeper paths such as `/api/people/1/` will create a deep directory structure
inside the root of the `cacheDir`.

### Cached Responses

Each cached response has the following format:
```javascript
{
  "request": { /* Request Being Proxied */ }
  "status": 200, /* Response Status Code */
  "type": "application/json", /* Response Content Type */
  "headers": { /* Response Headers */ }
  "data": { /* Response Payload */ }  // Can be object or string base on content type
}
```

Example Response:
```json
{
  "request": {
    "hostname": "swapi.co",
    "port": 80,
    "path": "/api/",
    "method": "GET",
    "headers": {},
    "body": "",
    "transaction": ""
  },
  "status": 200,
  "type": "application/json",
  "headers": {
    "content-type": "application/json",
    "allow": "GET, HEAD, OPTIONS",
    "x-frame-options": "SAMEORIGIN"
  },
  "data": {
    "people": "http://swapi.co/api/people/",
    "planets": "http://swapi.co/api/planets/",
    "films": "http://swapi.co/api/films/",
    "species": "http://swapi.co/api/species/",
    "vehicles": "http://swapi.co/api/vehicles/",
    "starships": "http://swapi.co/api/starships/"
  }
}
```

# Contribute

Contributions are welcome to the repository. There are a number of outstanding [issues](https://github.com/blad/mockingjays/issues), which we hope will enhance existing functionality, fix bugs, or add new functionality.

Please add an issue to propose new features, report bugs, and propose improvements.

[Git Hub Issues for Mockingjays](https://github.com/blad/mockingjays/issues)

# Questions

If you have questions about the use of Mockingjays please leave a message in the project's Gitter Chat Room.

[![Gitter](https://badges.gitter.im/blad/mockingjays.svg)](https://gitter.im/blad/mockingjays?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# ChangeLog

For a list of changes between versions please see the [CHANGELOG](./CHANGELOG.md) file.

# License: Apache 2.0
Copyright 2015 Bladymir Tellez\<btellez@gmail.com\>

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
