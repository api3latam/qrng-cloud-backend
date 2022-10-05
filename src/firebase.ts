import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import { getEnvVars } from "./utils";

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

export async function getAddresses(networkName) {
  const results = await firestore
    .collection("users")
    .where("signature", "array-contains", networkName)
    .get();
  let output = new Array();
  results.forEach(doc => {
    output.push(doc.id);
  });
  return output;
}
