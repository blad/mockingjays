Mockingjays
========================

*Mockingjays* is a proxying tool that responds to requests with responses that have been
previously observed.

*Mockingjays* acts as a mock server for previously seen requests and captures
new request for future use.

## Command Line
### Install Mockingjays
```bash
npm install -g mockingjays
```

### Start Mockingjays
```bash
mockingjays \
  --port=9000 \ # Port that the proxy server should bind to.
  --cacheDir=/var/app/fixtures \ # Place where cached responses are stored.
  --serverBaseUrl='http://swapi.co' # Place where an unseen request can be learned.
```

## Programatic API
```javascript
var Mockingjays = require('../mockingjays')
new Mockingjays().start({
  port: 9000, // Port that the proxy server should bind to.
  cacheDir: '/var/app/fixtures', // Place where cached responses are stored.
  serverBaseUrl: 'http://swapi.co' // Place where an unseen request can be learned.
});
```

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
