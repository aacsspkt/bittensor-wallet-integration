"use client";

import { useBittensorAccounts } from "@/hooks/useBittensor";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3FromAddress } from "@polkadot/extension-dapp";
import { cryptoWaitReady } from "@polkadot/util-crypto";

export default function Home() {
	const { accounts } = useBittensorAccounts();
	const wsProvider = new WsProvider("wss://entrypoint-finney.opentensor.ai:443");

	console.log("injected accounts", accounts);

	const handleTransferClick = async () => {
		try {
			await cryptoWaitReady();
			const api = await ApiPromise.create({ provider: wsProvider });
			const account = accounts[0];
			const wallet = await web3FromAddress(account.address);
			api.setSigner(wallet.signer);

			const recipient = "5FNaNCPDsJEhTqwY28pVA51LcB3seVY33NRzxUY6myEfim7o";
			const amount = 1000000000;

			console.log("balances:", Object.keys(api.tx.balances));

			const transfer = api.tx.balances.transferKeepAlive(recipient, amount);
			const hash = await transfer.signAndSend(account.address);

			console.log("hash:", hash.toHex());
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<button
					onClick={handleTransferClick}
					type="button"
					className="p-2 h-9 w-24 text-center items-center bg-blue-500 hover:bg-blue-400 text-black hover:text-opacity-80"
				>
					Transfer
				</button>
			</main>
		</div>
	);
}
