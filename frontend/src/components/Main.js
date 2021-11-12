import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/main/main.scss';
import logo from '../images/adidas-smm.svg';

const Main = ({children}) => {

  return (
    <div className="main">
      <div className="container">
        <div className="logo-wrapper">
          <Link to="/">
            <img src={logo} alt="adidas SMM"/>
          </Link>
        </div>
        {children}
        <footer>
          <div className="link-wrapper">
            <a href="/docs/QRcode_CONTEST_RULES.pdf" target="_blank">
              Terms and conditions
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Main;