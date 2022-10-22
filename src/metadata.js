import { Alchemy } from "alchemy-sdk";
import { utils } from "ethers";
import { contractAddresses } from "./network.js";
import { getTimestamps, updateMetadata, updateMetaStatus } from "./firebase.js";
import { alchemyConfigs, getTokenIds } from "./alchemy.js";

const main = async () => {
    const networkNames = Object.keys(contractAddresses);

    for (let i=0; i < networkNames.length; i++) {
        let currentNetwork = networkNames[i];

        const targetAddresses = await getTimestamps(currentNetwork);
        let alchemy = new Alchemy(alchemyConfigs(currentNetwork));
        let contractAddr = utils.getAddress(contractAddresses[currentNetwork]);

        console.log(`Working metadata for network: ${currentNetwork}\n`);
        for (let j=0; j < targetAddresses.length; j++) {
            let currentAddress = utils.getAddress(targetAddresses[j]);
            console.log(`Updating for address: ${currentAddress}\n`)
            let userTimestamps = await getTokenIds(
                currentAddress,
                alchemy,
                contractAddr);
            let timestamps = userTimestamps.map((token) => {return token.minted});
            let latestTimestamp = Math.max.apply(Math, timestamps);
            await updateMetadata(
                currentAddress, 
                currentNetwork,
                userTimestamps,
                latestTimestamp);
            await updateMetaStatus(currentAddress, currentNetwork);
        }
        console.log(`Done for network: ${currentNetwork}`);
	process.exit(0);
    }
};

main();
