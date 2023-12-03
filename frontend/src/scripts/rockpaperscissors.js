import { readContract, writeContract, waitForTransaction, prepareWriteContract } from '@wagmi/core';
import { avalancheFuji, polygonMumbai } from "@wagmi/core/chains"
import RockPaperScissors from '../../abis/RockPaperScissors.json'

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
        console.error(error);
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

export async function tryUpgradePlayerOnAvax(wallet) {
    try {
        return "";
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function tryUpgradePlayerOnPolygon(wallet) {
    try {
        return "";
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function tryDowngradePlayerOnAvax(wallet) {
    try {
        return "";
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function tryDowngradePlayerOnPolygon(wallet) {
    try {
        return "";
    } catch (error) {
        console.error(error);
        return null;
    }
}

