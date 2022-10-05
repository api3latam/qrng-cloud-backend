import { Contract } from "ethers";
import abi from "./abi";
import { getSigner, contractAddresses } from "./network";

export async function getContract(network) {
    const address = contractAddresses[network];
    const signer = await getSigner(network);
    const contract = new Contract(address, abi, signer);
    return contract;
};
