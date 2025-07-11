// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
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
const auth = getAuth();

// Submit Handler
const submit = document.getElementById("submit");
submit.addEventListener("click", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.querySelectorAll("input[type='password']")[1]
    .value;

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // Create user
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Update Firebase Auth profile with name
      return updateProfile(user, {
        displayName: name,
      }).then(() => {
        alert("Account created successfully!");
        window.location.href = "../login.html";
      });
    })
    .catch((error) => {
      alert(error.message);
    });
});
