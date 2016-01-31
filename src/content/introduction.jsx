import React from 'react';
import style from './introduction.styl'
let Introduction = React.createClass({
  render() {
    return (
      <div className='introduction'>
        <h1>Using Mockingjays</h1>
        <p>
          Install Mockingjays from NPM:
        </p>
        <pre>
          npm install mockingjays
        </pre>
        <p>
          After installing Mockingjays you can start an instance via the command
          line interface or via the JavaScript API.
        </p>
        <p>
          Command Line API:
        </p>
        <pre>
{`mockingjays \\
  --baseServerUrl='http://swapi.co' \\
  --cacheDir='./cache'`}
        </pre>
        <p>
          JavaScript API:
        </p>
        <pre>
{`var mockingjays = new Mockingjays();
mockingjays.start({baseServerUrl='http://swapi.co', cacheDir='./cache'});`}
        </pre>

        <h1>Use Cases</h1>
        <h2>Introspection</h2>
        <h2>Offline Development</h2>
        <h2>Fixture Generation</h2>
        <h2>Integration Testing</h2>

        <h1>Community</h1>
        <h2>Issues</h2>
        <h2>Contributions</h2>
        
      </div>
    );
  }
});

export default Introduction;
