// login.js
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const { auth } = window;

onAuthStateChanged(auth, (user) => {
    if (user) { window.location.href = '/dashboard'; }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    try {
        await signInWithEmailAndPassword(auth, email, password);
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
