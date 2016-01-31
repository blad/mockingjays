import React from 'react';

let Introduction = React.createClass({
  render() {
    return (
      <div className='introduction'>
        <div className='content'>
          <h1>Using Mockingjays</h1>
          <p>
            Install Mockingjays from NPM:
          </p>
          <pre>
            npm install -g mockingjays
          </pre>
          <p>
            After installing Mockingjays you can start an instance via the command
            line interface or via the JavaScript API.
          </p>
          <p>
            Command Line API:
          </p>
          <pre>
{`mockingjays serve\\
  --baseServerUrl='http://swapi.co' \\
  --port=9000 \\
  --cacheDir='./cache'`}
          </pre>
          <p>
            JavaScript API:
          </p>
          <pre>
{`var Mockingjays = require('mockingjays');
var mockingjays = new Mockingjays();
mockingjays.start({
  baseServerUrl='http://swapi.co',
  cacheDir='./cache'
});`}
          </pre>
        </div>
      </div>
    );
  }
});

export default Introduction;
