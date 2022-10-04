import { providers,
    Wallet } from "ethers";

export async function getSigner() {
    require("dotenv").config();
    try {
        const rpc = process.env[`${process.env['NETWORK']}_URL`];
        const provider = new providers.JsonRpcProvider(rpc);
        const pk = process.env['WALLET_PK'] || "";
        const wallet = new Wallet(pk, provider);
        return wallet;
    } catch (err) {
        console.error(err);
    }
};
