import { exit } from "process";
import { getContract } from  "./contracts.js";
import { contractAddresses } from "./network.js";
import { getAddresses, 
    setMintingState } from "./firebase.js";

const handler = async (event, context) => {
    console.log('Starting process...\n')
    const networkNames = Object.keys(contractAddresses);
    for (let i=0; i < networkNames.length; i++) {
        try {
            let network = networkNames[i];
            // let contract = await getContract(network);
            let addressesArray = await getAddresses(network);
            console.log(`Doing network: ${network}\n`);
            for (let i=0; i < addressesArray.length; i++) {
                let address = addressesArray[i];
                console.log(`Minting for ${address}\n`);
                // let tx = await contract.requestToken(address);
                //  await tx.wait();
                await setMintingState();
            }
            console.log(`Done for network: ${network}\n`);
        } catch (err) {
            console.error(err);
            continue;
        }
    }
    console.log('Finished minting for all networks!\n');
    exit(0);
};


handler(null, null);
