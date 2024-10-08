"use client";

import {
  useEffect,
  useState,
} from 'react';

import {
  web3Accounts,
  web3Enable,
} from '@polkadot/extension-dapp';
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from '@polkadot/extension-inject/types';

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
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | null>(null)
  const [wallets, setWallets] = useState<InjectedExtension[] | null>(null)

  useEffect(() => {
    const enableWalletProviders = async () => {
      const _wallets = await web3Enable("my-bittensor-wallet-integration-test");
      setWallets(_wallets)
      // if (wallets.length === 0) {
      //     open("https://bittensor.com/wallet", "_blank")
      // }
      // const subWallet = wallets.find(w => w.name === "subwallet-js");

      const _accounts = await web3Accounts();
      setAccounts(_accounts)
    };

    enableWalletProviders();

    return () => {
      setAccounts(null)
      setWallets(null)
    };
  }, []);

  return { accounts, wallets }
}