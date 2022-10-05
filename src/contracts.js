import { Contract } from "ethers";
import abi from "./abi.js";
import { getSigner, contractAddresses } from "./network.js";

export async function getContract(network) {
    const address = contractAddresses[network];
    const signer = await getSigner(network);
    const contract = new Contract(address, abi, signer);
    return contract;
};
