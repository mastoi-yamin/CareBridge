import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

onAuthStateChanged(window.auth, async (user) => {
    if (!user) { window.location.href = "/login"; return; }

    const userData = await window.getUserData(user.uid);
    const role = userData.role;

    // 1. Update UI based on role
    document.getElementById('user-role-badge').textContent = role.toUpperCase();
    
    // 2. Load Stats & History
    let q;
    if (role === 'donor') {
        document.getElementById('stat-1').textContent = "Active Helper";
        q = query(collection(window.db, "requests"), where("fundedBy", "==", user.uid));
    } else {
        const status = (role === 'hospital' && !userData.isApproved) ? "Pending Approval" : "Verified";
        document.getElementById('stat-1').textContent = status;
        q = query(collection(window.db, "requests"), where("createdBy", "==", user.uid));
    }

    const snap = await getDocs(q);
    document.getElementById('stat-2').textContent = snap.size;

    // 3. Render the list (Reuse your card logic from requests page!)
    const list = document.getElementById('user-requests-list');
    if (snap.empty) {
        list.innerHTML = "<p>No history found yet. Start your journey!</p>";
    } else {
        snap.forEach(doc => {
            const data = doc.data();
            list.innerHTML += `
                <article>
                    <div class="grid">
                        <div>
                            <strong>${data.medicine}</strong><br>
                            <small>${data.status === 'funded' ? 'Funded' : 'Pending'}</small>
                        </div>
                        <div style="text-align: right;">$${data.cost}</div>
                    </div>
                </article>
            `;
        });
    }
});
