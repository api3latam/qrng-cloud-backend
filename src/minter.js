import { exit } from "process";
import { utils } from "ethers";
import { getContract } from  "./contracts.js";
import { contractAddresses } from "./network.js";
import { firebaseWorkflow, getAddresses } from "./firebase.js";

const main = async () => {
    console.log('Starting process...\n')
    const networkNames = Object.keys(contractAddresses);
    for (let i=0; i < networkNames.length; i++)  {
        try {
            let network = networkNames[i];
            let contract = await getContract(network);
            let addressesArray = await getAddresses(network);
            console.log(`Doing network: ${network}\n`);
            for (let i=0; i < addressesArray.length; i++) {
                let txHash;
                let address = addressesArray[i];
                console.log(`Minting for ${address}\n`);
                if (network === "polygon") {
                    let tx = await contract.requestToken(
                        address,
                        {
                            gasLimit: 150_000,
                            gasPrice: utils.parseUnits("250", "gwei"),
                        }
                    );
                    let receipt = await tx.wait();
                    txHash = receipt.transactionHash;
                }
                else {
                    let tx = await contract.requestToken(address);
                    let receipt = await tx.wait();
                    txHash = receipt.transactionHash;
                }
                await firebaseWorkflow(address, network);
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

main();
