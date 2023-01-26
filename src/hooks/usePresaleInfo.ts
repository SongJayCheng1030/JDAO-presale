import {
  JOY_DECIMALS,
  PRESALER_ADDRESS,
  USDC_DECIMALS,
} from '../constants/contracts';
import PresaleABI from '../constants/ABI/presaler.json';
import { useContract } from './useContract';
import { useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'ethers/lib/utils';
import { useIsMounted } from './useIsMounted';
import { SALE_TYPE } from '../constants'

export const usePresaleInfo = () => {
  const presaleContract = useContract(PRESALER_ADDRESS, PresaleABI);
  const isMounted = useIsMounted();

  const [presaleInfo, setPresaleInfo] = useState<{
    startDateTime?: Date;
    endDateTime?: Date;
    durationSeconds?: number;
    countDown?: number;
    buyRate?: number;
    joysForSale?: number;
    joysSold?: number;
    usdcRaised?: number;
    joysRemained?: number;
    usdcRemained?: number;
  }>({});

  const fetchPresaleInfo = useCallback(() => {
    if (presaleContract) {
      Promise.all([
        presaleContract.SALE_START(),
        presaleContract.SALE_DURATION(),
        presaleContract.coinList('0'),
        presaleContract.totalSaleAmount(),
        presaleContract.totalSoldAmount(),
        presaleContract.totalCoinAmount(),
      ])
        .then(
          ([start, duration, rate, tokensForSale, tokensSold, coinsRaised]) => {
            if (isMounted.current) {
              const startDateTime = new Date(parseInt(start.toString()) * 1000); // seconds to milliseconds
              const durationSeconds = parseInt(duration.toString());
              const endDateTime = new Date(
                (parseInt(start.toString()) + durationSeconds) * 1000
              );
              const countDown = (endDateTime.getTime() - Date.now()) / 1000;
              const buyRate = parseFloat(
                formatUnits(rate[1].toString(), USDC_DECIMALS)
              );
              const joysForSale = parseFloat(
                formatUnits(tokensForSale.toString(), JOY_DECIMALS)
              );
              const joysSold = parseFloat(
                formatUnits(tokensSold.toString(), JOY_DECIMALS)
              ) - (SALE_TYPE === '0' ? 0 : 200000000);
              const usdcRaised = parseFloat(
                formatUnits(coinsRaised.toString(), USDC_DECIMALS)
              );

              const joysRemained = joysForSale-joysSold;
              const usdcRemained = joysRemained * buyRate; 

              setPresaleInfo({
                startDateTime,
                endDateTime,
                durationSeconds,
                countDown,
                buyRate,
                joysForSale,
                joysSold,
                usdcRaised,
                joysRemained,
                usdcRemained
              });
            }
          }
        )
        .catch((err) => {
          console.log('--------------error')
          if (isMounted.current) {
            console.error(err);
            setPresaleInfo({});
          }
        });
    }
  }, [isMounted, presaleContract]);

  useEffect(() => {
    fetchPresaleInfo();
    const timer = setInterval(() => fetchPresaleInfo(), 3000);
    return () => {
      clearInterval(timer);
    };
  }, [fetchPresaleInfo]);

  return presaleInfo;
};
