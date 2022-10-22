import { Network } from "alchemy-sdk";

export const alchemyConfigs = (networkName) => {
    if (networkName === "polygon") {
        return { apiKey: process.env['NEXT_PUBLIC_POLYGON'],
            network: Network.MATIC_MAINNET }
    } else if (networkName === "optimism") {
        return { apiKey: process.env['NEXT_PUBLIC_OPTIMISM'],
            network: Network.OPT_MAINNET }
    } else if (networkName === "arbitrum") {
        return { apiKey: process.env['NEXT_PUBLIC_ARBITRUM'] ,
            network: Network.ARB_MAINNET}
    } else {
        throw Error(`The given network ${networkName} is not available`);
    }
};

export async function getTokenIds(
    userAddress, 
    alchemyClient, 
    contractAddress) {
        const nftsForOwner = await alchemyClient.nft.getNftsForOwner({
            owner: userAddress,
            contractAddresses: [contractAddress]
        });
        const ownedNfts = nftsForOwner.ownedNfts;
        const output = ownedNfts.map((token) => {
            return {
                id: token.tokenId,
                uri: token.tokenUri.raw,
                minted: new Date(token.timeLastUpdated)
            } 
        })
        return output;
};
