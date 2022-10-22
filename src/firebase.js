import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import { getEnvVars } from "./utils.js";

const firebaseConfig = {
  apiKey: getEnvVars('FIREBASE_API'),
  authDomain: "quantum-choice.firebaseapp.com",
  projectId: "quantum-choice",
  storageBucket: "quantum-choice.appspot.com",
  messagingSenderId: getEnvVars("FIREBASE_MESSAGE"),
  appId: getEnvVars("FIREBASE_ID"),
  measurementId: "G-2HP3ERTHWP"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const firestore = firebase.firestore();
const enableGoerli = getEnvVars("ENABLE_TEST") === "true" ? true : false;

const networkUpdate = (networkName) => {
  if (networkName === "optimism") {
      return { 'minted.optimism': true }
  } else if (networkName === "polygon") {
      return { 'minted.polygon': true }
  } else if (networkName === "arbitrum") {
      return { 'minted.arbitrum': true }
  } else if (networkName === "goerli" && enableGoerli) {
      return { 'minted.goerli': true }
  } else {
      throw Error(`The given network ${networkName} is not available`);
  }
}

const metaUpdate = (networkName) => {
  if (networkName === "optimism") {
      return { 'updated.optimism': true }
  } else if (networkName === "polygon") {
      return { 'updated.polygon': true }
  } else if (networkName === "arbitrum") {
      return { 'updated.arbitrum': true }
  } else if (networkName === "goerli" && enableGoerli) {
      return { 'updated.goerli': true }
  } else {
      throw Error(`The given network ${networkName} is not available`);
  }
}

const metadataSet = (networkName, timestamp, tokenData) => {
  if (networkName === "optimism") {
    return timestamp >= 0 
      ? { lastMinted: timestamp, optimism: tokenData }
      : { optimism: tokenData };
  } else if (networkName === "arbitrum") {
    return timestamp >= 0 
      ? { lastMinted: timestamp, arbitrum: tokenData }
      : { arbitrum: tokenData };
  } else if (networkName === "polygon") {
    return timestamp >= 0 
      ? { lastMinted: timestamp, polygon: tokenData }
      : { polygon: tokenData }
  } else if (networkName === "goerli" && enableGoerli) {
    return timestamp >= 0 
      ? { lastMinted: timestamp, goerli: tokenData }
      : { goerli: tokenData }
  } else {
    throw Error(`The given network ${networkName} is not available`);
  }
}

export async function getAddresses(networkName) {
  try {
    const results = await firestore
      .collection("users")
      .where(`signature.${networkName}`, "!=", "")
      .where(`minted.${networkName}`, "==", false)
      .limit(10)
      .get();
    let output = new Array();
    if (!results.empty) {
      results.forEach(doc => {
        output.push(doc.id);
      });
    };
    return output;
  } catch (err) {
    console.error(err);
  }
};

export async function setMintingState(targetAddress, network) {
  try {
    await firestore
      .collection("users")
      .doc(targetAddress)
      .update(networkUpdate(network));
  } catch (err) {
    console.error(err);
  }
};

export async function getTimestamps(network) {
  let addresses = [];
  const docs = await firestore
    .collection("users")
    .where(`updated.${network}`, '!=', 'true')
    .get();

  docs.forEach((doc) => {
    addresses.push(doc.id);
  })
  return addresses;
}

export async function updateMetadata(
  userAddress, network, alchemyData, probNewLatest
  ) {
    const [ lastMinted, docExistence, networkExistence ] 
      = await getLatestMint(userAddress);
    const updateMinted = lastMinted > 0 
      ? lastMinted < probNewLatest
      : false;
    if (!docExistence) {
      await firestore
        .collection("metadata")
        .doc(userAddress)
        .set(metadataSet(network, probNewLatest, alchemyData));
    } else if (docExistence && !networkExistence && !updateMinted) {
      await firestore
        .collection("metadata")
        .doc(userAddress)
        .update(metadataSet(network, -1, alchemyData));
    } else if (docExistence && !networkExistence && updateMinted) {
      await firestore
        .collection("metadata")
        .doc(userAddress)
        .update(metadataSet(network, probNewLatest, alchemyData));
    }
}

async function getLatestMint(address, network) {
  let timeMinted;
  let networkExists;
  const doc = await firestore
    .collection("metadata")
    .doc(address)
    .get();
  const docExists = doc.exists;
  if (docExists) {
    timeMinted = new Date(doc.data()['lastMinted']);
    networkExists = doc.data()[network] === undefined
      ? false : true;
  } else {
    timeMinted = 0;
  }
  return [ timeMinted, docExists, networkExists ]
};

export async function updateMetaStatus(userAddress, network) {
  await firestore
      .collection("users")
      .doc(userAddress)
      .update(metaUpdate(network));
}
