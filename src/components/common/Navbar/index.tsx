import React from 'react';
import SocialMedia from '../SocialMedia';
import { Link } from 'react-router-dom';

import Styles from './navbar.module.scss';

type NavMenu = {
  name: string;
  url: string;
  type?: 'internal' | 'external';
};

const desktopMenus: NavMenu[] = [
  {
    name: 'LOAN/BORROW',
    url: 'https://apply.joystickgames.com',
    type: 'external',
  },
  {
    name: 'EDUCATION',
    url: 'https://education.joystickgames.com',
    type: 'external',
  },
  {
    name: 'SHOP',
    url: '',
  },
];

const mobileMenus: NavMenu[] = [{ name: 'HOME', url: '/' }, ...desktopMenus];

type NavBarProps = {
  handleClick?: () => void
}

export default function NavBar({handleClick}: NavBarProps) {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  /******************** METHODS *************************/
  function handleResize() {
    const width = window.innerWidth;
    if (width <= 767) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  /******************** USE EFFECTS *************************/
  React.useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  }, []);
  return (
    <div className={Styles.navWrapper}>
      <nav className={Styles.navs}>
        {isMobile
          ? mobileMenus.map((menu: NavMenu, index: number) => <MenuItem key={index} menu={menu} handleClick={handleClick} />)
          : desktopMenus.map((menu: NavMenu, index: number) => <MenuItem key={index} menu={menu} handleClick={handleClick} />)}
      </nav>
      <SocialMedia className={Styles.mobileNav} />
    </div>
  );
}

type MenuItemProps = {
  handleClick?: () => void
  menu: NavMenu;
};

function MenuItem({ menu, handleClick }: MenuItemProps) {
  const urlPath = window.location.pathname;

  return (
    <>
      <div onClick={handleClick} className={Styles.menuItem}>
        {menu.type === 'external' ? (
          <a href={menu.url} target="_blank" rel="noreferrer">
            {menu.name}
          </a>
        ) : (
          <Link
            className={urlPath === menu.url ? Styles.active : ''}
            to={menu.url}
          >
            {menu.name}
          </Link>
        )}
      </div>
    </>
  );
}
