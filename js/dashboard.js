import { collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { guard } from '/js/guard.js';

const list = document.getElementById('user-requests-list');

const { user, userData } = await guard({ access: 'auth' });
const role = userData.role;

document.getElementById('user-name').textContent = userData.name || user.email;
document.getElementById('user-role-badge').textContent = role.toUpperCase();

if (role === 'admin') {
    document.getElementById('stat-1').textContent = "System Overseer";
    document.getElementById('stat-2-label').textContent = "Pending Approvals";
    document.getElementById('history-heading').textContent = "Pending Hospital Approvals";

    const qHosp = query(
        collection(window.db, "users"),
        where("role", "==", "hospital"),
        where("isApproved", "==", false)
        // ✅ no != clause, no composite index needed
    );
    const snapHosp = await getDocs(qHosp);

    // filter rejected hospitals client-side
    const pendingHospitals = snapHosp.docs.filter(d => !d.data().isRejected);

    document.getElementById('stat-2').textContent = pendingHospitals.length;

    if (pendingHospitals.length === 0) {
        list.innerHTML = "<p>All hospitals are verified.</p>";
    } else {
        pendingHospitals.forEach(hDoc => {
            const hosp = hDoc.data();
            const card = document.createElement('article');
            card.id = `hosp-card-${hDoc.id}`;
            card.innerHTML = `
                <div class="grid">
                    <div>
                        <strong>${hosp.name}</strong><br>
                        <small>${hosp.email} · ${hosp.country}, ${hosp.city}</small><br>
                        <small>Applied: ${hosp.appliedAt?.toDate().toLocaleDateString()}</small>
                    </div>
                    <div style="text-align: right; display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="outline" onclick="approveHosp('${hDoc.id}')">Approve</button>
                        <button class="outline secondary" onclick="rejectHosp('${hDoc.id}')">Reject</button>
                    </div>
                </div>
                ${hosp.answers?.length ? `
                <details style="margin-top: 0.75rem;">
                    <summary>View Answers</summary>
                    <p><b>Q1:</b> ${hosp.answers[0]}</p>
                    <p><b>Q2:</b> ${hosp.answers[1]}</p>
                </details>` : ''}
                ${hosp.files?.legalDoc ? `
                <a href="${hosp.files.legalDoc}" target="_blank" class="outline secondary" role="button" style="margin-top: 0.5rem; display: inline-block;">
                    View Legal Doc
                </a>` : ''}
            `;
            list.appendChild(card);
        });
    }

} else if (role === 'hospital' && !userData.isApproved) {
    document.getElementById('stat-1').textContent = "Pending Approval";
    document.getElementById('history-heading').textContent = "Application Status";
    document.getElementById('stat-2').textContent = "—";
    list.innerHTML = `
        <article>
            <p>Your hospital application is under review. Our team will verify it within <strong>48 hours</strong>.</p>
            <p>You'll receive an email once approved.</p>
        </article>
    `;

} else {
    let q;
    if (role === 'donor') {
        document.getElementById('stat-1').textContent = "Active Helper";
        document.getElementById('stat-2-label').textContent = "Requests Funded";
        q = query(collection(window.db, "requests"), where("fundedBy", "==", user.uid));
    } else {
        document.getElementById('stat-1').textContent = role === 'hospital' ? "Verified Hospital" : "Active";
        document.getElementById('stat-2-label').textContent = "Requests Submitted";
        q = query(collection(window.db, "requests"), where("createdBy", "==", user.uid));
    }

    const snap = await getDocs(q);
    document.getElementById('stat-2').textContent = snap.size;

    if (snap.empty) {
        list.innerHTML = "<p>No history yet. Start your journey!</p>";
    } else {
        snap.forEach(docSnap => {
            const data = docSnap.data();
            const isFunded = data.status === 'funded';
            const card = document.createElement('article');

            if (role === 'donor') {
                card.innerHTML = `
                    <div class="grid">
                        <div>
                            <strong>${data.medicine}</strong><br>
                            <small>${data.type === 'hospital' ? 'Hospital' : 'Individual'}</small><br>
                            <small>${data.createdAt?.toDate().toLocaleDateString()}</small>
                        </div>
                        <div style="text-align: right;">
                            <span style="color: var(--pico-color-green-500);">Funded</span><br>
                            <strong>$${data.cost}</strong>
                        </div>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="grid">
                        <div>
                            <strong>${data.medicine}</strong><br>
                            ${data.patientId ? `<small>Patient: ${data.patientId}</small><br>` : ''}
                            <small>${data.createdAt?.toDate().toLocaleDateString()}</small>
                        </div>
                        <div style="text-align: right;">
                            <span style="color: ${isFunded ? 'var(--pico-color-green-500)' : 'var(--pico-color-orange-500)'}">
                                ${isFunded ? 'Funded' : 'Pending'}
                            </span><br>
                            <strong>$${data.cost}</strong>
                        </div>
                    </div>
                `;
            }
            list.appendChild(card);
        });
    }
}

window.approveHosp = async (uid) => {
    if (!confirm("Approve this hospital?")) return;
    await updateDoc(doc(window.db, "users", uid), { isApproved: true });
    document.getElementById(`hosp-card-${uid}`)?.remove();
    const remaining = document.querySelectorAll('[id^="hosp-card-"]').length;
    if (remaining === 0) list.innerHTML = "<p>All hospitals are verified.</p>";
    const stat2 = document.getElementById('stat-2');
    stat2.textContent = Math.max(0, parseInt(stat2.textContent) - 1);
};

window.rejectHosp = async (uid) => {
    if (!confirm("Reject this hospital application?")) return;
    await updateDoc(doc(window.db, "users", uid), { isApproved: false, isRejected: true });
    document.getElementById(`hosp-card-${uid}`)?.remove();
    const remaining = document.querySelectorAll('[id^="hosp-card-"]').length;
    if (remaining === 0) list.innerHTML = "<p>All hospitals are verified.</p>";
    const stat2 = document.getElementById('stat-2');
    stat2.textContent = Math.max(0, parseInt(stat2.textContent) - 1);
};
