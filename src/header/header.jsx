import React from 'react';
import style from './header.styl';

let Header = React.createClass({

  getDefaultProps() {
    return {
      logoPath: 'dist/images/mockingjays-logo.png'
    }
  },

  render() {
    return (
      <div className='header'>
        <img src={this.props.logoPath} className='logo'/>
        <h1>Mockingjays</h1>
        <h2>Proxy Observers that Mimic HTTP Interactions</h2>
      </div>
    );
  }
});



export default Header
