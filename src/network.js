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
    arbitrum: "0x6F7951a45B87Df328927e07CEA5771539013B812",
    polygon: "0x0904593F8886f20761f9610aBc8789B86ad386f3",
    optimism: "0xcC0f0d89146ce1B01948E421E90d2aeAa47718f7"
}
