import React from 'react';
import style from './footer.styl'

let Footer = React.createClass({
  getDefaultProps() {
    return {links: [
        {
          displayName: 'Mockingjays GitHub Repository',
          link: 'https://github.com/blad/mockingjays',
          icon: 'dist/images/github-logo.png'
        },
        {
          displayName: 'Mockingjays on NPM',
          link: 'npmjs.com/package/mockingjays',
          icon: 'dist/images/github-logo.png'
        },
        {
          displayName: 'Issues & Feature Requests',
          link: 'https://github.com/blad/mockingjays/issues',
          icon: 'dist/images/github-logo.png'
        },
      ]
    }
  },

  render() {
    return (
      <div className='footer'>
        <ul>
          {this.props.links.map((link, index) => {
            return (
              <li key={`link-${index}`}>
                <a href={link.link}>
                  <img src={link.icon}/>{link.displayName}
                </a>
              </li>)
          })}
        </ul>
      </div>
    );
  }
});

export default Footer;
