import { getContract } from "./contracts";
import { contractAddresses } from "./network";
import { getAddresses } from "./firebase";

exports.handler = async (event, context) => {
    console.log('Starting process...\n')
    const networkNames = Object.keys(contractAddresses);
    for (let i=0; i < networkNames.length; i++) {
        let network = networkNames[i];
        let contract = await getContract(network);
        let addressesArray = await getAddresses(network);
        console.log(`Doing network: ${network}\n`);
        for (let i=0; i < addressesArray.length; i++) {
            let address = addressesArray[i];
            console.log(`Minting for ${address}\n`);
            let tx = await contract.requestToken(address);
            await tx.wait();
        }
        console.log(`Done for network: ${network}\n`);
    }
    console.log('Finished minting for all networks!\n');
};
