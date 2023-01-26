import { useCallback, useContext, useState } from 'react';
import { parseEther } from 'ethers/lib/utils';

import { Asset, PRESALER_ADDRESS } from '../constants/contracts';
import PresaleABI from '../constants/ABI/presaler.json';
import { useContract } from './useContract';
import { useIsMounted } from './useIsMounted';
import { triggerToast } from '../utils';
import { UserContext } from '../contexts/UserContext';
import * as Sentry from '@sentry/react';
import { useWeb3Provider, usePresaleInfo } from '../hooks';
import { trackingService } from '../services';
import { DEFAULT_PASSWORD } from '../constants';

export const usePresaleDeposit = () => {
  const presaleContract = useContract(PRESALER_ADDRESS, PresaleABI, true);
  const [isDepositing, setIsDepositing] = useState(false);
  const isMounted = useIsMounted();
  const { setIsTransactionModalOpened, setCurrencyAmount } =
    useContext(UserContext);
  const { account } = useWeb3Provider();
  const presaleInfo = usePresaleInfo();

  const deposit = useCallback(
    (amount: number, asset: Asset) => {
      if (presaleContract) {
        setIsDepositing(true);
        presaleContract
          .deposit(parseEther(amount.toString()), asset === 'USDC' ? '0' : '1')
          .then((txPreHash: any) => txPreHash.wait())
          .then(async (txHash: any) => {
            if (isMounted.current) {
              Sentry.captureMessage(txHash.transactionHash, {
                tags: {
                  section: 'deposit',
                },
              });
              const password =
                localStorage.getItem('joystickdao.password') ||
                DEFAULT_PASSWORD;
              const buyRate = presaleInfo.buyRate || 0.04;

              triggerToast('SUCCESS');
              setIsTransactionModalOpened(true);
              setCurrencyAmount('');

              (window as any).gtag('set', { currency: 'USD' });
              (window as any).gtag('event', 'purchase', {
                value: amount,
                label: asset,
              });

              try {
                trackingService.createTracking(
                  password || '',
                  account || '',
                  txHash.transactionHash,
                  amount,
                  amount / buyRate
                );
              } catch (e) {}
            }
          })
          .catch((err: any) => {
            console.error(err);
            Sentry.captureException(err, {
              tags: {
                section: 'deposit',
              },
            });
            triggerToast('ERROR');
          })
          .then(() => {
            if (isMounted.current) {
              setIsDepositing(false);
            }
          });
      }
    },
    [
      presaleContract,
      isMounted,
      presaleInfo.buyRate,
      account,
      setIsTransactionModalOpened,
      setCurrencyAmount,
    ]
  );

  return {
    isDepositing,
    deposit,
  };
};
