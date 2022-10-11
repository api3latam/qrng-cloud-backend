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
    goerli: "0x961F8787035c2280479589DaB31BdD7186a8B577",
    arbitrum: "",
    polygon: "",
    optimism: ""
}
