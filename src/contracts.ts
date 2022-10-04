import { Contract } from "ethers";
import abi from "./abi";
import { getSigner } from "./network";

export async function getContract() {
    const address = "0x759934c1BA49D14B4961c7B7fde86948160a4359";
    const signer = await getSigner();
    const contract = new Contract(address, abi, signer);
    return contract;
};
