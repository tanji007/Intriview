import { auth, signOut, onAuthStateChanged } from "./firebase.js";

// Logout Button
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("username");
        window.location.href = "login.html";
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        alert("Something went wrong while logging out.");
      });
  });
}

// Auth check: redirect if not logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});
