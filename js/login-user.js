import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { guard } from '/js/guard.js';

// Guard handles the redirect-if-logged-in case
await guard({ access: 'guest' });

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    try {
        const userCredential = await signInWithEmailAndPassword(window.auth, email, password);
        const userData = await window.getUserData(userCredential.user.uid);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userName', userData.name);
        message.textContent = 'Success! Redirecting...';
        setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
    } catch (error) {
        message.textContent = 'Error: ' + error.message;
    }
});
