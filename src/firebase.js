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

