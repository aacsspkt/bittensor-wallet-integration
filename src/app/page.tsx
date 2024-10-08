"use client";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { useBittensorAccounts } from "@/hooks/useBittensor";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3FromAddress } from "@polkadot/extension-dapp";

interface TransferForm {
	sender: string;
	receiver: string;
	amount: number;
}

export default function Home() {
	const { accounts } = useBittensorAccounts();
	const wsProvider = new WsProvider("wss://entrypoint-finney.opentensor.ai:443");
	const [response, setResponse] = useState<string | undefined>(undefined);

	console.log("injected accounts", accounts);

	const { setValue, getValues, handleSubmit } = useForm<TransferForm>({
		defaultValues: {
			amount: 0,
			receiver: "",
			sender: "",
		},
	});

	useEffect(() => {
		if (accounts && accounts.length) {
			setValue("sender", accounts[0].address);
		}
	}, [accounts, setValue]);

	const handleTransfer = async (data: TransferForm) => {
		console.log("here");
		try {
			// await cryptoWaitReady();
			const api = await ApiPromise.create({ provider: wsProvider });

			const sender = data.sender;
			const receiver = data.receiver;
			const amount = data.amount * 1000000000;
			// const recipient = "5FNaNCPDsJEhTqwY28pVA51LcB3seVY33NRzxUY6myEfim7o";

			const wallet = await web3FromAddress(sender);
			api.setSigner(wallet.signer);

			// console.log("balances:", Object.keys(api.tx.balances));

			const transfer = api.tx.balances.transferKeepAlive(receiver, amount);
			const hash = await transfer.signAndSend(sender);

			console.log("hash:", hash);
			console.log("hash human:", hash.toHuman());
			setResponse(`Success: ${hash.toHuman()}`);
		} catch (err) {
			console.error(err);
			if (err instanceof Error) {
				setResponse(err.message);
			}
		}
	};

	return (
		<main className="h-screen w-screen flex flex-col justify-center items-center">
			<form
				onSubmit={handleSubmit(handleTransfer)}
				className="w-[800px] grid border dark:border-white p-8 rounded"
			>
				<legend className="text-2xl font-bold mb-5">Transfer Tao</legend>
				<div className="w-full space-y-2 mb-4">
					<label htmlFor="sender">Sender: </label>
					<input
						disabled={true}
						className="w-full p-2 rounded"
						placeholder="Sender"
						type="text"
						name="sender"
						id="sender"
						value={getValues("sender")}
					/>
				</div>
				<div className="w-full space-y-2 mb-4">
					<label htmlFor="receiver">Receiver: </label>
					<input
						className="w-full  p-2 rounded text-black"
						placeholder="Receiver"
						type="text"
						name="receiver"
						id="receiver"
						value={getValues("receiver") != "" ? getValues("receiver") : undefined}
						onChange={(e) => setValue("receiver", e.target.value)}
					/>
				</div>
				<div className="w-full space-y-2 mb-6">
					<label htmlFor="amount">Amount: </label>
					<input
						className="w-full  p-2 rounded text-black"
						placeholder="Amount"
						type="number"
						name="amount"
						step={"any"}
						value={getValues("amount") > 0 ? getValues("amount") : undefined}
						onChange={(e) => setValue("amount", Number(e.target.value))}
						id="amount"
					/>
				</div>
				<button
					type="submit"
					className="p-2 h-9 w-24 mb-6 rounded text-center items-center bg-blue-500 hover:bg-blue-400 text-black hover:text-opacity-80"
				>
					Transfer
				</button>
				<p className={!response ? "hidden" : ""}>{response}</p>
			</form>
		</main>
	);
}
