import { writeContract, waitForTransaction, prepareWriteContract } from '@wagmi/core';
import { avalancheFuji } from "@wagmi/core/chains"
import KanvasAvax from '../../abis/KanvasAvax.json'

const plans = ['0', '0', '5000000000000000000', '20000000000000000000']

export async function tryCreateGame(game) {
    try {
        console.log(game);
        const config = await prepareWriteContract({
            address: KanvasAvax.networks[avalancheFuji.id].address,
            abi: KanvasAvax.abi,
            functionName: 'createGame',
            args: [game],
            value: plans[game.plan],
            chainId: avalancheFuji.id
        });

        const { hash } = await writeContract(config);

        return await waitForTransaction({ hash: hash });
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function tryAddTemplate(uri, gameId) {
    try {
        const config = await prepareWriteContract({
            address: KanvasAvax.networks[avalancheFuji.id].address,
            abi: KanvasAvax.abi,
            functionName: 'addTemplate',
            args: [uri, gameId],
            chainId: avalancheFuji.id
        });

        const { hash } = await writeContract(config);

        return await waitForTransaction({ hash: hash });
    } catch (error) {
        console.error(error);
        return null;
    }
}