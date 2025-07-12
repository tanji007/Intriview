import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  getFirestore,
  setDoc,
  doc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDowPfOU7qWA_kyfAY1KWF0SlJ5A7gBl3c",
  authDomain: "intriview-ai.firebaseapp.com",
  projectId: "intriview-ai",
  storageBucket: "intriview-ai.firebasestorage.app",
  messagingSenderId: "676660422876",
  appId: "1:676660422876:web:120ec95c69ab29ecaaac19",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  setDoc,
  doc,
  serverTimestamp,
};
