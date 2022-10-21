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

const firestore = firebase.firestore();

const networkUpdate = (networkName) => {
  if (networkName === "optimism") {
      return { 'minted.optimism': true }
  } else if (networkName === "polygon") {
      return { 'minted.polygon': true }
  } else if (networkName === "arbitrum") {
      return { 'minted.arbitrum': true }
  } else {
      throw Error(`The given network ${networkName} is not available`);
  }
}

const addressNetwork = (networkName, hash, currentDate) => {
  if (networkName === "optimism") {
    return { "optimism": [{txHash: hash, minted: currentDate}] }
  } else if (networkNmae === "polygon") {
    return {"polygon": [{txHash: hash, minted: currentDate}]}
  } else if (networkName === "arbitrum") {
    return {"arbitrum": [{txHash: hash, minted: currentDate}]}
  }
}

const appendAddress = (networkName, hash, currentDate) => {
  if (networkName === "optimism") {
    return { 
      lastMinted: currentDate,
      "network.optimism": firebase.firestore.FieldValue.arrayUnion(
        [{txHash: hash, minted: currentDate}])
      }
  } else if (networkNmae === "polygon") {
    return { 
      lastMinted: currentDate,
      "network.polygon": firebase.firestore.FieldValue.arrayUnion(
        [{txHash: hash, minted: currentDate}])
      }
  } else if (networkName === "arbitrum") {
    return { 
      lastMinted: currentDate,
      "network.arbitrum": firebase.firestore.FieldValue.arrayUnion(
        [{txHash: hash, minted: currentDate}])
      }
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
}

async function setMintingState(targetAddress, network) {
  try {
    await firestore
      .collection("users")
      .doc(targetAddress)
      .update(networkUpdate(network));
  } catch (err) {
    console.error(err);
  }
};

async function setMintingData(
  targetAddress, network, txHash) {
  try {
    const [ dockExists, networkExists ] =
      await verifyExistence(targetAddress, network);
    const date = Date.now();
    if (!dockExists) {
      await firestore
        .collection("address")
        .doc(targetAddress)
        .set({
          lastMinted: date,
          network: addressNetwork(network, txHash, date)
        })
    } else if (dockExists && !networkExists) {
      await firestore
        .collection("address")
        .doc(targetAddress)
        .update({
          lastMinted: date,
          network: addressNetwork(network, txHash, date)
        })
    } else if (dockExists && networkExists) {
      await firestore
        .collection("address")
        .doc(targetAddress)
        .update(appendAddress(network, txHash, date))
    }
  } catch (err) {
    console.error(err);
  }
};

export async function firebaseWorkflow (
  address, networkName, hash) {
  await setMintingState(address, networkName);
  await setMintingData(address, networkName, hash);
}

async function verifyExistence(address, network) {
  let dockExistence = false;
  let networkExistence = false;
  const doc = await firestoreClient
      .collection("address")
      .doc(address)
      .get();
  if (doc.exists) {
      dockExistence = true;
      networkExistence = 
          doc.data()['network'][network] === undefined
          ? false
          : true;
  }
  return [ dockExistence, networkExistence ];
};

