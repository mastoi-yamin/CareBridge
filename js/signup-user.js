import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { guard } from '/js/guard.js';

await guard({ access: 'guest' });

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const { auth, db } = window;
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
        await setDoc(doc(db, "users", user.uid), {
            name: fullname, email, role, createdAt: new Date()
        });
        const userData = await window.getUserData(user.uid);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userName', userData.name);
        message.textContent = 'Success! Redirecting...';
        setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
    } catch (error) {
        message.textContent = 'Error: ' + error.message;
    }
});
