import { firestore } from "./firebase.js";

const unpackNetworks = (networkList) => {
    const entries = networkList.map((network) => {
        return [network, false];
    })
    return Object.fromEntries(entries);
}

const main = async () => {
    const docs = await firestore
        .collection("users")
        .get();

    let addresses = [];
    docs.forEach((indDoc) => {
        addresses.push({ 
            id: indDoc.id, 
            networks: Object.keys(indDoc.data()['minted']) 
        })
    });

    for (let i=0; i < addresses.length; i++) {
        console.log(`Updating for address: ${addresses[i].id}\n`);
        await firestore
            .collection("users")
            .doc(addresses[i].id)
            .update({
                updated: unpackNetworks(addresses[i].networks)
            });
    }
    
    console.log('Done!\n');
    process.exit(0);
};

main();
