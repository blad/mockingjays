import React from 'react';
import ReactDOM from 'react-dom';
import style from './index.styl';
import Header from './header/header.jsx';
import Footer from './footer/footer.jsx';
import Introduction from './content/introduction.jsx'

let MockingjaysApp = React.createClass({
  render() {
    return (
      <div>
        <Header/>
        <Introduction/>
        <Footer/>
      </div>
    );
  }
})

let target = document.getElementById('app-container');
ReactDOM.render(<MockingjaysApp/>, target);
