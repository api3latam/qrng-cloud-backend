import { providers, Wallet } from "ethers";
import { getEnvVars } from "./utils.js";

export async function getSigner(networkName) {
    try {
        const rpc = getEnvVars(`${networkName.toUpperCase()}_URL`);
        const provider = new providers.JsonRpcProvider(rpc);
        const pk = getEnvVars('WALLET_PK');
        const wallet = new Wallet(pk, provider);
        return wallet;
    } catch (err) {
        console.error(err);
    }
};

export const contractAddresses = {
    goerli: "0x759934c1BA49D14B4961c7B7fde86948160a4359",
    arbitrum: "",
    polygon: "",
    rsk: ""
}
