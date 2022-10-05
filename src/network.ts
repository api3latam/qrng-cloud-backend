import { providers,
    Wallet } from "ethers";

export async function getSigner(networkName) {
    require("dotenv").config();
    try {
        const rpc = process.env[`${networkName}_URL`];
        const provider = new providers.JsonRpcProvider(rpc);
        const pk = process.env['WALLET_PK'] || "";
        const wallet = new Wallet(pk, provider);
        return wallet;
    } catch (err) {
        console.error(err);
    }
};

export const contractAddresses = {
    goerli: "0x759934c1BA49D14B4961c7B7fde86948160a4359",
    arbitru: "",
    polygon: "",
    rsk: ""
}
