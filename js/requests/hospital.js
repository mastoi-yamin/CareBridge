import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { guard } from '/js/guard.js';

// Only approved hospitals can post hospital requests
await guard({ access: 'auth', roles: ['hospital'], approvedOnly: true });

document.getElementById('hospRequestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await addDoc(collection(window.db, "requests"), {
        type: 'hospital',
        createdBy: window.auth.currentUser.uid,
        patientId: document.getElementById('patientId').value,
        medicine: document.getElementById('medName').value,
        cost: Number(document.getElementById('cost').value),
        urgent: document.getElementById('urgent').value === 'true',
        status: 'pending',
        createdAt: new Date()
    });
    alert("Request Live!");
    window.location.href = '/requests';
});
