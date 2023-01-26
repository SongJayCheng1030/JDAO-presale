import React from 'react';
import { JoyStickLogo, CloseIconMobileNav, MobileNavIcon } from '../../icons';
import NavBar from '../Navbar';

import Styles from './header.module.scss';

export default function Header() {
  const [show, setShow] = React.useState<boolean>(false);

  /******************** METHODS *************************/
  const toggleMobNav = () => {
    setShow(prev => !prev)
  };


  /******************** USE EFFECTS *************************/


  return (
    <header className={Styles.header}>
      <div className={Styles.desktop}>
        <JoyStickLogo className={Styles.logo} />
        <NavBar />
      </div>

      <div className={Styles.mobile}>
        <div className={Styles.mobileNavWrapper}>
          <JoyStickLogo className={Styles.logo} />
          {show ? <CloseIconMobileNav onClick={toggleMobNav} /> : <MobileNavIcon onClick={toggleMobNav} />}
        </div>
       {
         show ? <div className={Styles.navContainer}> <NavBar handleClick={() => {
           setShow(false)
         }} /></div>: null
       }
      </div>
    </header>
  );
}
