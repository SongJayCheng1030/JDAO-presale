import './PresalePanel.scss';

import { useContext, useMemo, useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

import RefreshSvg from '../../../assets/svg/refresh.svg';
import IDAOPrivateTitleImg from '../../../assets/img/private-presale-header-bar.svg';
import IDAOSeedTitleImg from '../../../assets/img/seed-presale-header-bar.svg';
import TopBorderImg from '../../../assets/img/presale-border-top.png';
import BottomBorderImg from '../../../assets/img/presale-border-bottom.png';
import VerticalBorderImg from '../../../assets/img/border-vertical-presale.png';
import { UserContext } from '../../../contexts/UserContext';
import {
  useERC20Approve,
  useERC20Balance,
  usePresaleDeposit,
  usePresaleInfo,
  useWeb3Provider,
} from '../../../hooks';
import CurrencyInput from '../../../components/CurrencyInput';
import ActionButton from '../../../components/ActionButton';
import Loader from '../../../components/Loader';
import GlowBorderedCard from './GlowBorderedCard';
import HowToBuyModal from './HowToBuyModal';
import DepositConfirmModal from './DepositConfirmModal';
import { Asset } from '../../../constants/contracts';
import { getNormalizedPriceString, triggerToast } from '../../../utils';
import { SALE_TYPE } from '../../../constants';
// const percentages = [25, 50, 75, 100];

const PresalePanel = () => {
  const { currencyAmount, setIsWalletConnectOpened, setCurrencyAmount } =
    useContext(UserContext);

  const [asset, setAsset] = useState<Asset>('USDC');
  const { active } = useWeb3Provider();
  const [assetBalance, refreshAssetBalance] = useERC20Balance(asset);
  const [xjoyBalance] = useERC20Balance('xJOY');
  const presaleInfo = usePresaleInfo();
  const { isApproved, isApproving, approve } = useERC20Approve(asset);
  const { isDepositing, deposit } = usePresaleDeposit();
  const [isVisibleHowToModal, setVisibleHowToModal] = useState<boolean>(false);
  const [isVisibleDepositConfirmModal, setVisibleDepositConfirmModal] = useState<boolean>(false);

  const isPresaleLive = useMemo<boolean>(
    () =>
      Boolean(
        presaleInfo.endDateTime &&
          presaleInfo.endDateTime.getTime() >= Date.now()
      ),
    [presaleInfo.endDateTime]
  );

  const isSoldOut = useMemo(
    () =>
      typeof presaleInfo.joysRemained !== 'undefined' &&
      presaleInfo.joysRemained < 1,
    [presaleInfo.joysRemained]
  );

  useEffect(() => {
    if (isApproved) {
      setVisibleDepositConfirmModal(true);
    }
  }, [isApproved]);

  const isShownDepositConfirmModal = useMemo<boolean>(
    () =>
      Boolean(
        isApproved && isVisibleDepositConfirmModal
      ),
    [isApproved, isVisibleDepositConfirmModal]
  );

  const ctaBtn = useMemo(() => {
    const btnContent = isSoldOut ? (
      'Sold Out'
    ) : active ? (
      isPresaleLive ? (
        isApproved ? (
          isDepositing ? (
            <>
              <Loader />
              Depositing
            </>
          ) : (
            'Deposit'
          )
        ) : isApproving ? (
          <>
            <Loader />
            Waiting Approval
          </>
        ) : (
          'Approve'
        )
      ) : (
        'Sale Not Started'
      )
    ) : (
      'Connect Wallet'
    );

    return (
      <ActionButton
        color={isSoldOut ? 'red' : undefined}
        disabled={
          isSoldOut ||
          (active && (!currencyAmount || !isPresaleLive) && isApproved)
        }
        onClick={() => {
          if (active) {
            if (isApproved) {
              if (!isDepositing && presaleInfo.usdcRemained) {
                const amount = parseFloat(currencyAmount);
                if (presaleInfo.usdcRemained < amount) {
                  triggerToast(
                    'LIMIT_EXCEED',
                    (
                      (presaleInfo.joysRemained ?? 0) *
                      (presaleInfo.buyRate ?? 0)
                    ).toLocaleString()
                  );
                } else {
                  deposit(amount, asset);
                }
              }
            } else if (!isApproving) {
              approve();
            }
          } else {
            setIsWalletConnectOpened(true);
          }
        }}
      >
        {btnContent}
      </ActionButton>
    );
  }, [
    active,
    approve,
    asset,
    currencyAmount,
    deposit,
    isApproved,
    isApproving,
    isDepositing,
    isPresaleLive,
    isSoldOut,
    presaleInfo.buyRate,
    presaleInfo.joysRemained,
    presaleInfo.usdcRemained,
    setIsWalletConnectOpened,
  ]);

  const onAssetChange = (newAsset: Asset) => {
    if (asset !== newAsset) {
      setAsset(newAsset);
      setCurrencyAmount('');
    }
  };

  return (
    <div className="presale-panel">
      <img
        className="presale-heading-img"
        src={SALE_TYPE === '0' ? IDAOSeedTitleImg : IDAOPrivateTitleImg}
        alt=""
      />

      <div className="presale-panel-wrapper">
        <img
          className="presale-horizontal-border presale-top-border"
          src={TopBorderImg}
          alt=""
        />
        <img
          className="presale-horizontal-border presale-bottom-border"
          src={BottomBorderImg}
          alt=""
        />
        <img
          className="presale-vertical-border presale-left-border"
          src={VerticalBorderImg}
          alt=""
        />
        <img
          className="presale-vertical-border presale-right-border"
          src={VerticalBorderImg}
          alt=""
        />

        <div className="presale-sale-status">
          <p>
            {SALE_TYPE === '0'
              ? 'Welcome to our private seed round'
              : 'Welcome to our discounted private sale'}
            !
          </p>
        </div>

        <div className="presale-pannel-inner">
          <div className="presale-cta">
            <button className="presale-cta-button default">Deposit</button>
            <button className="presale-cta-button">Withdraw</button>
          </div>

          <div className="presale-currency-select-row">
            <div className="presale-currency-select-title">
              I want to deposit
            </div>

            <div className="presale-usdc-balance">
              <button
                onClick={() =>
                  assetBalance && setCurrencyAmount(assetBalance.toString())
                }
              >
                Balance:{' '}
                {assetBalance?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) ?? '--'}
              </button>
              <button onClick={refreshAssetBalance}>
                <img src={RefreshSvg} alt="" />
              </button>
            </div>

            {/*
            <div className="presale-currency-select-list">
              {percentages.map((percentage) => (
                <button
                  onClick={() =>
                    assetBalance &&
                    setCurrencyAmount(
                      ((assetBalance * percentage) / 100).toString()
                    )
                  }
                >
                  {percentage}%
                </button>
              ))}
            </div>
            */}
          </div>
          <CurrencyInput
            value={currencyAmount}
            onChange={setCurrencyAmount}
            selectedAsset={asset}
            onAssetChange={onAssetChange}
            maxValue={assetBalance}
          />

          <div className="presale-cta-row">
            <div className="connect-btn-wrapper">{ctaBtn}</div>
          </div>

          <div className="presale-info-grid">
            <GlowBorderedCard
              tag={
                SALE_TYPE === '0'
                  ? '86% Discount to Market'
                  : '66% Discount to Market'
              }
              title="Your Price"
              content={`$${
                presaleInfo.buyRate?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) ?? '0.00'
              }`}
            />
            <GlowBorderedCard title="Market Price" content="$0.30" />
            <GlowBorderedCard
              title="Your Balance"
              content={`${getNormalizedPriceString(xjoyBalance ?? 0)} JOY`}
            />
            <GlowBorderedCard
              title="USD Value"
              content={`$${getNormalizedPriceString(0.3 * (xjoyBalance ?? 0))}`}
            />
          </div>

          <div className="user-guide">
            <p>
              {SALE_TYPE === '0'
                ? 'When purchasing $JOY during this seed round period you will receive a 86% discount off of the public sale price.'
                : 'When purchasing $JOY during this private sale period you will receive a 66% discount off of the public sale price.'}
            </p>
            <p>
              {SALE_TYPE === '0'
                ? 'After you purchase $JOY in our seed round your coins will automatically be staked in $xJOY. You will begin to earn rewards and grow your holdings as soon as staking is live! A portion of your staking rewards will be instantly unlocked.'
                : 'After you purchase $JOY in our private sale your coins will automatically be staked in $xJOY. You will begin to earn rewards and grow your holdings as soon as staking is live! A portion of your staking rewards will be instantly unlocked.'}
            </p>
            <p>
              {SALE_TYPE === '0'
                ? '$JOY tokens purchased during the seed round will be locked in $xJOY for 8 months and begin vesting for 40 months.'
                : '$JOY tokens purchased during the private sale will be locked in $xJOY for 8 months and begin vesting for 40 months.'}
            </p>
            <p>
              <i>
                *Please note that $xJOY tokens will be locked to the wallet
                address they were purchased from until $JOY tokens are claimed.*
              </i>
            </p>
          </div>
        </div>
      </div>

      <div className="presale-instruction">
        <div
          onClick={() => { setVisibleHowToModal(true) }}
          className="presale-instruction-cta"
        >
          Click Here
        </div>{' '}
        for instructions on how to purchase the $JOY Token
      </div>
      <ReactTooltip id="sale-end-countdown" type="success" effect="solid">
        <p className="presale-tooltip">
          Invest into Joystick at our IDO price before it hits the public! Our
          sale period ends soon
        </p>
      </ReactTooltip>
      <HowToBuyModal isVisibleHowToModal={isVisibleHowToModal} setVisibleHowToModal={setVisibleHowToModal} />
      <DepositConfirmModal isVisibleDepositConfirmModal={isShownDepositConfirmModal} setVisibleDepositConfirmModal={setVisibleDepositConfirmModal} />
    </div>
  );
};

export default PresalePanel;
