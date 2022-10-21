import { Alchemy } from "alchemy-sdk";
import { utils } from "ethers";
import { contractAddresses } from "./network.js";
import { getTimestamps } from "./firebase.js";
import { alchemyConfigs, getTokenIds } from "./alchemy.js";

const main = async () => {
    const [ docsData, addressesDict ] = await getTimestamps();
    const networkNames = Object.keys(addressesDict);

    for (let i=0; i < networkNames.length; i++) {
        let alchemy = new Alchemy(alchemyConfigs(networkNames[i]));
        let contractAddr = utils.getAddress(contractAddresses[network]);
        let targetAddresses = addressesDict[networkNames[i]];

        for (let j=0; j < targetAddresses.length; j++) {
            let toAdd = await getTokenIds(
                targetAddresses[j],
                alchemy,
                contractAddr);
        }
    }
};

main();
