import {
  auth,
  db,
  createUserWithEmailAndPassword,
  updateProfile,
  setDoc,
  doc,
  serverTimestamp,
} from "./firebase.js";

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

  // Create user in Firebase Auth
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Update display name in Firebase Auth
      await updateProfile(user, {
        displayName: name,
      });

      // Save user info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: serverTimestamp(),
      });

      alert("Account created successfully!");
      window.location.href = "../login.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});
