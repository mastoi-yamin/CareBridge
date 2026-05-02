import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { guard } from '/js/guard.js';

// Only individuals can post individual requests
await guard({ access: 'auth', roles: ['individual'] });

document.getElementById('indRequestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await addDoc(collection(window.db, "requests"), {
        type: 'individual',
        createdBy: window.auth.currentUser.uid,
        medicine: document.getElementById('medNameInd').value,
        cost: Number(document.getElementById('costInd').value),
        urgent: false,
        status: 'pending',
        createdAt: new Date()
    });
    alert("Request Posted!");
    window.location.href = '/requests';
});
