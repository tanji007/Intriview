// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDowPfOU7qWA_kyfAY1KWF0SlJ5A7gBl3c",
  authDomain: "intriview-ai.firebaseapp.com",
  projectId: "intriview-ai",
  storageBucket: "intriview-ai.firebasestorage.app",
  messagingSenderId: "676660422876",
  appId: "1:676660422876:web:120ec95c69ab29ecaaac19",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Submit
const submit = document.getElementById("submit");
submit.addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      alert("Logging in");
      window.location.href = "dashboard.html";
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      // ..
    });
});
