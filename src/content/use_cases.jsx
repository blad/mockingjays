import React from 'react';

let UseCases = React.createClass({
  render() {
    return (
      <div className='use-cases light-section'>
        <div className='content'>
          <h1>Use Cases</h1>
          <h2>Develop Offline</h2>
          <p>
            Mockingjays faciliatates offline development by saving the HTTP cache
            to the filesystem where it can be saved in version control. The cache
            resides along side the source files with the intention that it should
            be updated and maintained along with the source code.
          </p>
          <h2>Simplify Testing</h2>
          <p>
            Keeping a cache of known requests and responses ensures that we can
            run integration test against a set of data that looks like the real
            thing (because it's based on it).
          </p>
          <h2 className='planned'>Generate Fixtures[Planned Feature]</h2>
          <p className='planned'>
            Observing real HTTP requests and responses allow the generation of
            of fixtures that can be used as test-fixtures. The fixtures can be
            used to ensure that bug regressions are avoided and ensure that an
            update to an API has not changes the expected behavior.
          </p>
        </div>
      </div>
    );
  }
});

export default UseCases;
