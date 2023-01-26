import './Footer.scss';

import React from 'react';
import Logo from '../../../assets/img/logo.svg';
import SocialLinks from '../../../components/SocialLinks';

const Footer = () => {
  return (
    <div className="home-footer">
      <div className="inner">
        <div>
          <img className="logo" src={Logo} alt="logo" />
          <div className="desc-txt">
            Copyright {new Date().getFullYear() - 1} -{' '}
            {new Date().getFullYear()} &copy;
          </div>
        </div>
        <div>
          <SocialLinks />
          <div className="terms-txt">
            {/*
            <a href="/" className="terms-txt">
              Terms and Conditions
            </a>
            <a href="/" className="terms-txt">
              Privacy Policy
            </a>
            */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
