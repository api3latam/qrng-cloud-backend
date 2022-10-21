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

const addressNetwork = (networkName, currentDate) => {
  if (networkName === "optimism") {
    return { "optimism": [{minted: currentDate}] }
  } else if (networkName === "polygon") {
    return {"polygon": [{minted: currentDate}]}
  } else if (networkName === "arbitrum") {
    return {"arbitrum": [{minted: currentDate}]}
  } else if (networkName === "goerli" && enableGoerli) {
    return {"goerli": [{minted: currentDate}]}
  } else {
    throw Error(`The given network ${networkName} is not available`);
  }
}

const appendAddress = (networkName, currentDate) => {
  if (networkName === "optimism") {
    return { 
      lastMinted: currentDate,
      "network.optimism": firebase.firestore.FieldValue.arrayUnion(
        [{minted: currentDate}])
      }
  } else if (networkName === "polygon") {
    return { 
      lastMinted: currentDate,
      "network.polygon": firebase.firestore.FieldValue.arrayUnion(
        [{minted: currentDate}])
      }
  } else if (networkName === "arbitrum") {
    return { 
      lastMinted: currentDate,
      "network.arbitrum": firebase.firestore.FieldValue.arrayUnion(
        [{minted: currentDate}])
      }
  } else if (networkName === "goerli" && enableGoerli) {
    return { 
      lastMinted: currentDate,
      "network.goerli": firebase.firestore.FieldValue.arrayUnion(
        [{minted: currentDate}])
      }
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

async function setMintingData(targetAddress, network) {
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
          network: addressNetwork(network, date)
        })
    } else if (dockExists && !networkExists) {
      await firestore
        .collection("address")
        .doc(targetAddress)
        .update({
          lastMinted: date,
          network: addressNetwork(network, date)
        })
    } else if (dockExists && networkExists) {
      await firestore
        .collection("address")
        .doc(targetAddress)
        .update(appendAddress(network, date))
    }
  } catch (err) {
    console.error(err);
  }
};

export async function firebaseWorkflow (address, networkName) {
  await setMintingState(address, networkName);
  await setMintingData(address, networkName);
}

async function verifyExistence(address, network) {
  let dockExistence = false;
  let networkExistence = false;
  const doc = await firestore
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

