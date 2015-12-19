Mockingjays
========================

[![Circle CI Build Status](https://circleci.com/gh/blad/mockingjays.png?circle-token=a4bd29bc70058220eb8e663e848ff4448231d79a)](https://circleci.com/gh/blad/mockingjays)
[![npm version](https://badge.fury.io/js/mockingjays.svg)](https://www.npmjs.com/package/mockingjays)
[![Gitter](https://badges.gitter.im/blad/mockingjays.svg)](https://gitter.im/blad/mockingjays?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

*Mockingjays* is a proxying tool that responds to requests with responses that have been
previously observed.

*Mockingjays* acts as a mock server for previously seen requests and captures
new request for future use.

## Install Mockingjays
```bash
npm install -g mockingjays
```

## CLI Use
```bash
mockingjays \
  --cacheDir=/var/app/fixtures \ # Required
  --serverBaseUrl='http://swapi.co' \ # Required
  --cacheHeader='authorization,content-length'
  --ignoreContentType='image/*,text/html' \
  --port=9000 \
  --refresh=true \
```

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
- **port** - Port that the proxy server should bind to.
  - *Default: 9000*
- **ignoreContentType** - Comma separated list of content-types that should be skipped. This can include a `*` which will be a wildcard match equivalent to the `.*` RegEx. No File Types Ignored by default.
  - *Default: ''*
- **refresh** - Indicates if the request/response cache should be updated unconditionally.
  - *Default: false*



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
    "body": ""
  },
  "status": 200,
  "type": "application/json",
  "headers": {
    "date": "Mon, 23 Nov 2015 05:32:11 GMT",
    "content-type": "application/json",
    "transfer-encoding": "chunked",
    "connection": "close",
    "set-cookie": [
      "__cfduid=d2899211d5e45cad84e75ad06258784af1448256730; expires=Tue, 22-Nov-16 05:32:10 GMT; path=/; domain=.swapi.co; HttpOnly"
    ],
    "allow": "GET, HEAD, OPTIONS",
    "x-frame-options": "SAMEORIGIN",
    "vary": "Accept, Cookie",
    "etag": "\"1f7a4766c9ebf66cdb1ddb85d5cc6f2f\"",
    "via": "1.1 vegur",
    "server": "cloudflare-nginx",
    "cf-ray": "249a7df825bf39a0-PHX"
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
