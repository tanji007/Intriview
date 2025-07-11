// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
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

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Navbar reference
const dashboardLink = document.getElementById("dashboard");

// Step 1: Immediately set from localStorage if available
const savedName = localStorage.getItem("username");
if (savedName && dashboardLink) {
  dashboardLink.textContent = savedName;
  dashboardLink.href = "dashboard.html";
}

// Step 2: Use Firebase to validate auth and sync
onAuthStateChanged(auth, (user) => {
  if (dashboardLink) {
    if (user) {
      const name = user.displayName || "Dashboard";
      dashboardLink.textContent = name;
      dashboardLink.href = "dashboard.html";
      localStorage.setItem("username", name); // Save for future page loads
    } else {
      dashboardLink.textContent = "Login";
      dashboardLink.href = "login.html";
      localStorage.removeItem("username"); // Clear if logged out
    }
  }
});
