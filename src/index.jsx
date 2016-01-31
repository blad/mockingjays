import React from 'react';
import ReactDOM from 'react-dom';
import style from './index.styl';
import Header from './header/header.jsx';
import Footer from './footer/footer.jsx';
import Introduction from './content/introduction.jsx';
import UseCases from './content/use_cases.jsx';
import Community from './content/community.jsx';

let MockingjaysApp = React.createClass({
  render() {
    return (
      <div>
        <Header/>
        <Introduction/>
        <UseCases/>
        <Community/>
        <Footer/>
      </div>
    );
  }
})

let target = document.getElementById('app-container');
ReactDOM.render(<MockingjaysApp/>, target);
