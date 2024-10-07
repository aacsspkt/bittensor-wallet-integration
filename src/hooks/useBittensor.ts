import {
  useEffect,
  useState,
} from 'react';

import {
  web3AccountsSubscribe,
  web3Enable,
} from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

// declare global {
//   interface Window {
//     injectedWeb3: {
//       [key: string]: {
//         enable: (e: unknown, i: unknown) => unknown,
//         version: string
//       }
//     }
//   }
// }

export const useBittensorAccounts = () => {
  const [injectedAccounts, setInjectedAccounts] = useState<InjectedAccountWithMeta[]>([])

  useEffect(() => {
    let unsubscribe: () => void | undefined;

    const enableWalletProviders = async () => {
      await web3Enable("my-bittensor-wallet-integration-test");
      // if (wallets.length === 0) {
      //     open("https://bittensor.com/wallet", "_blank")
      // }


      unsubscribe = await web3AccountsSubscribe(accounts => {
        setInjectedAccounts(accounts)
      })
    };

    enableWalletProviders();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { accounts: injectedAccounts }
}