Mockingjays
========================

Mockingjays is a proxying library that mocks APIs requests only after
observing a request and response a single time.

The idea behind Mockingjays is that when mocking you *should* not need to
spend time copying and pasting requests and responses to test your app
logic against a mock implementation of the API.

The caveat being that you need to train Mockingjays, but this can be done 
simply by having Mocking.js observe(proxy) the interactions with your
API at least once.

## Command Line
### Install Mockingjays
```bash
npm install -g moockingjays
```

### Start Mockingjays
```bash
mockingjays \
  --port=9000 \
  --cache-dir=/var/app/fixtures \
  --server-base-url='http://swapi.co/api/'
```

## Programatic API
```javascript
Mockingjays = require('mockingjays');
options = {
  port: 9000,
  cacheDir: '/var/app/fixtures',
  serverBaseUrl: 'http://swapi.co/api/'
};

Mockingjays.start(options);
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
