import { auth, onAuthStateChanged } from "./firebase.js";

// Target the dashboard or profile link
const dashboardLink = document.getElementById("dashboard");

// 1️⃣ Show from localStorage immediately (faster UI)
const savedName = localStorage.getItem("username");
if (savedName && dashboardLink) {
  dashboardLink.textContent = savedName;
  dashboardLink.href = "dashboard.html";
}

// 2️⃣ Sync with Firebase Auth (most accurate)
onAuthStateChanged(auth, (user) => {
  if (dashboardLink) {
    if (user) {
      const name = user.displayName || "Dashboard";
      dashboardLink.textContent = name;
      dashboardLink.href = "dashboard.html";
      localStorage.setItem("username", name);
    } else {
      dashboardLink.textContent = "Login";
      dashboardLink.href = "login.html";
      localStorage.removeItem("username");
    }
  }
});
