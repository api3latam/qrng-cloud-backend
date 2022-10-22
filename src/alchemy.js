import { Network } from "alchemy-sdk";
import { utils } from "ethers";
import { getEnvVars } from "./utils.js";

const getApiKey = (network) => {
    if (network === "polygon") {
        return getEnvVars("POLYGON_API");
    } else {
        try {
            const url = getEnvVars(`${network.toUpperCase()}_URL`)
            const splitted = url.split('/');
            return splitted[splitted.length];
        } catch (err) {
            console.error(err);
        }
    }
};

export const alchemyConfigs = (networkName) => {
    if (networkName === "polygon") {
        return { apiKey: getApiKey('polygon'),
            network: Network.MATIC_MAINNET }
    } else if (networkName === "optimism") {
        return { apiKey: getApiKey('optimism'),
            network: Network.OPT_MAINNET }
    } else if (networkName === "arbitrum") {
        return { apiKey: getApiKey('arbitrum'),
            network: Network.ARB_MAINNET}
    } else if (networkName === "goerli") {
        return { apiKey: getApiKey('goerli'),
            network: Network.ETH_GOERLI }
    } else {
        throw Error(`The given network ${networkName} is not available`);
    }
};

export async function getTokenIds(
    userAddress, 
    alchemyClient, 
    contractAddress) {
        const nftsForOwner = await alchemyClient.nft.getNftsForOwner(
            userAddress);
        const ownedNfts = nftsForOwner.ownedNfts;
        const filter = ownedNfts.filter((token) => {
            if (utils.getAddress(token.contract.address) === contractAddress) {
                return token
            }
        });
        const output = filter.map((token) => {
            return {
                id: token.tokenId,
                uri: token.tokenUri.raw,
                minted: new Date(token.timeLastUpdated)
            } 
        })
        return output;
};
