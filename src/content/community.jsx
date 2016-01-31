import React from 'react';

let Community = React.createClass({
  render() {
    return (
      <div className='community'>
        <div className='content'>
          <h1>Project</h1>
          <h2>Contribute</h2>
          <p>
            Contributions are welcome to the repository. There are a number of
            outstanding issues, which we hope will enhance existing functionality,
            fix bugs, or add new functionality. Or contribute by adding an issue
            to propose a new feature, report a bug, or propose improvements.
          </p>
          <p>
            <a href='https://github.com/blad/mockingjays/issues'>Git Hub Issues for Mockingjays</a>
          </p>
        </div>
      </div>
    );
  }
});

export default Community;
