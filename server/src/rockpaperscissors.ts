import Web3 from 'web3';

import RockPaperScissors from './abis/RockPaperScissors.json';
import RockPaperScissorsInterop from './abis/RockPaperScissorsInterop.json';

const Rpcs = {
    43113: 'https://avalanche-fuji-c-chain.publicnode.com',
    80001: 'https://polygon-mumbai-bor.publicnode.com'
};

const privateKey = process.env.EVM_PRIVATE_KEY;

export class RockPaperScissorsController {
    async upgradePlayer(chainId: 43113 | 80001, playerId: string): Promise<string | null> {
        try {
            const web3 = new Web3(Rpcs[chainId]);

            let contract;
            if (chainId == 43113) {
                contract = new web3.eth.Contract((RockPaperScissors as any).abi, RockPaperScissors.networks[chainId].address);
            } else {
                return null;
                // contract = new web3.eth.Contract((RockPaperScissorsInterop as any).abi, RockPaperScissorsInterop.networks[chainId].address);
            }

            const account = web3.eth.accounts.privateKeyToAccount(privateKey);
            web3.eth.accounts.wallet.add(account);

            const gas = await contract.methods.upgradePlayer(playerId).estimateGas({
                from: account.address
            });
            const gasPrice = await web3.eth.getGasPrice();

            const { transactionHash } = await contract.methods.upgradePlayer(playerId).send({
                from: account.address,
                gasPrice: gasPrice,
                gas: gas
            });

            return transactionHash;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async downgradePlayer(chainId: 43113 | 80001, playerId: string): Promise<string | null> {
        try {
            const web3 = new Web3(Rpcs[chainId]);

            let contract;
            if (chainId == 43113) {
                contract = new web3.eth.Contract((RockPaperScissors as any).abi, RockPaperScissors.networks[chainId].address);
            } else {
                return null;
                // contract = new web3.eth.Contract((RockPaperScissorsInterop as any).abi, RockPaperScissorsInterop.networks[chainId].address);
            }

            const account = web3.eth.accounts.privateKeyToAccount(privateKey);
            web3.eth.accounts.wallet.add(account);

            const gas = await contract.methods.downgradePlayer(playerId).estimateGas({
                from: account.address
            });
            const gasPrice = await web3.eth.getGasPrice();

            const { transactionHash } = await contract.methods.downgradePlayer(playerId).send({
                from: account.address,
                gasPrice: gasPrice,
                gas: gas
            });

            return transactionHash;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}