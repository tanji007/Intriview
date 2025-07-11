// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDowPfOU7qWA_kyfAY1KWF0SlJ5A7gBl3c",
  authDomain: "intriview-ai.firebaseapp.com",
  projectId: "intriview-ai",
  storageBucket: "intriview-ai.firebasestorage.app",
  messagingSenderId: "676660422876",
  appId: "1:676660422876:web:120ec95c69ab29ecaaac19",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Logout button listener
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // Clear localStorage
      localStorage.removeItem("username");

      // Redirect to login or homepage
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Logout failed:", error);
      alert("Something went wrong while logging out.");
    });
});

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Redirect to login if user is not logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});
