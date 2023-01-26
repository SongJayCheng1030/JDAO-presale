import './PresaleHeader.scss';

import { useContext, useState } from 'react';

import Logo from '../assets/img/logo.svg';
import HeaderLogo from '../assets/img/presale-banner-logo.png';
import ChevronDownImg from '../assets/img/chevron-down.svg';
import { UserContext } from '../contexts/UserContext';
import { useWeb3Provider } from '../hooks';
import { getWalletAddressAbbr } from '../utils';

const Header = () => {
  const { isWalletConnectOpened, setIsWalletConnectOpened } =
    useContext(UserContext);
  const { account, active, deactivate } = useWeb3Provider();
  const [isWalletInfoOpened, setIsWalletInfoOpened] = useState(false);

  return (
    <div className="presale-header">
      <img className="presale-header-bg" src={HeaderLogo} alt="" />
      <div className="presale-header-container">
        <img className="presale-logo" src={Logo} alt="logo header" />
        <button
          className="presale-wallet-btn"
          onClick={() => {
            if (active) {
              setIsWalletInfoOpened(!isWalletInfoOpened);
            } else {
              !isWalletConnectOpened
                ? setIsWalletConnectOpened(true)
                : setIsWalletConnectOpened(false);
            }
          }}
        >
          {active ? (
            <>
              <span>{getWalletAddressAbbr(account)}</span>
              <img src={ChevronDownImg} alt="" />
            </>
          ) : (
            'Connect Wallet'
          )}
        </button>

        {active && isWalletInfoOpened ? (
          <button
            className="wallet-info-button"
            onClick={() => {
              deactivate();
              setIsWalletInfoOpened(false);
            }}
          >
            Disconnect
          </button>
        ) : null}
      </div>
    </div>
  );
};
export default Header;
