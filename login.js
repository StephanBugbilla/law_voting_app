import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB9S48VgJ5oOSLSmnOMIJI5-84s9l4FERI",
  authDomain: "law-voting-app-a31d2.firebaseapp.com",
  projectId: "law-voting-app-a31d2",
  storageBucket: "law-voting-app-a31d2.firebasestorage.app",
  messagingSenderId: "718947262752",
  appId: "1:718947262752:web:c30b06d0acca283fd83745",
  measurementId: "G-4TX1218GL1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("loginForm").addEventListener("submit", async function(event) {
  event.preventDefault();
  const idNumber = document.getElementById("idNumber").value.trim();

  if (!idNumber) {
    alert("Please enter your ID number.");
    return;
  }

  // 1. Get user document from Firestore
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("idNumber", "==", idNumber));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    alert("No user found with this ID number.");
    return;
  }

  const userData = querySnapshot.docs[0].data();
  const email = userData.email;
  const password = idNumber; // Or userData.password if stored

  try {
    // 2. Sign in using Firebase Auth with retrieved email
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // 3. Store session info
    sessionStorage.setItem("userIdNumber", idNumber);
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userUid", userCredential.user.uid);

    // 4. Redirect
    window.location.href = "voting_page.html";
  } catch (error) {
    alert("Authentication failed: " + error.message);
  }
});
