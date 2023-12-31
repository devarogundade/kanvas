import { readContract, writeContract, waitForTransaction, prepareWriteContract } from '@wagmi/core';
import { avalancheFuji, polygonMumbai } from "@wagmi/core/chains"
import RockPaperScissors from '../../abis/RockPaperScissors.json'
import axios from 'axios'

export function gameId(chainId) {
    return RockPaperScissors.networks[chainId].address;
}

export async function tryCreatePlayer(wallet, name) {
    try {
        const config = await prepareWriteContract({
            address: RockPaperScissors.networks[avalancheFuji.id].address,
            abi: RockPaperScissors.abi,
            functionName: 'createPlayer',
            args: [wallet, name],
            chainId: avalancheFuji.id
        });

        const { hash } = await writeContract(config);

        return await waitForTransaction({ hash: hash });
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function tryGetPlayerOnAvax(wallet) {
    try {
        return readContract({
            address: RockPaperScissors.networks[avalancheFuji.id].address,
            abi: RockPaperScissors.abi,
            functionName: 'getPlayer',
            args: [wallet],
            chainId: avalancheFuji.id
        })
    } catch (error) {
        console.error(error);
        return null;
    }
}

const POLYGON_SELECTOR = '12532609583862916517';

export async function tryTransferToPolygon() {
    try {
        const config = await prepareWriteContract({
            address: RockPaperScissors.networks[avalancheFuji.id].address,
            abi: RockPaperScissors.abi,
            functionName: 'transferTo',
            args: [POLYGON_SELECTOR],
            chainId: avalancheFuji.id,
            value: 0
        })

        const { hash } = await writeContract(config);

        return await waitForTransaction({ hash: hash });
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function tryGetPlayerOnPolygon(wallet) {
    try {
        return readContract({
            // address: RockPaperScissorsAvax,
            abi: RockPaperScissors.abi,
            functionName: 'getPlayer',
            args: [wallet],
            chainId: polygonMumbai.id
        })
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function tryUpgradePlayer(chainId, wallet) {
    try {
        const response = await axios.get(`https://kanvas.azurewebsites.net/rockpaperscissors/upgrade/${chainId}/${wallet}`)
        return response.data.txId
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function tryDowngradePlayer(chainId, wallet) {
    try {
        const response = await axios.get(`https://kanvas.azurewebsites.net/rockpaperscissors/downgrade/${chainId}/${wallet}`)
        return response.data.txId
    } catch (error) {
        console.error(error);
        return null;
    }
}