import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const { auth, db } = window; // Grab from window

  const fullname = document.getElementById('fullname').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;
  const message = document.getElementById('message');

  message.textContent = 'Creating account...';

  try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullname });

      // Modular Firestore: setDoc(doc(db, collection, id), data)
      await setDoc(doc(db, "users", user.uid), {
          name: fullname,
          email: email,
          role: role,
          createdAt: new Date()
      });

      message.textContent = 'Success! Redirecting...';
      
      const userData = await window.getUserData(user.uid);

      // 🚨 SAVE TO STORAGE HERE
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userName', userData.name);
      
      setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
  } catch (error) {
      message.textContent = 'Error: ' + error.message;
  }
});
