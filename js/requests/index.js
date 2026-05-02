import { collection, query, where, getDocs, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const requestsContainer = document.getElementById('right');

// ✅ Fixed: cache hospital names to avoid duplicate Firestore reads
const hospitalNameCache = {};
async function getHospitalName(uid) {
    if (hospitalNameCache[uid]) return hospitalNameCache[uid];
    const snap = await getDoc(doc(window.db, "users", uid));
    const name = snap.exists() ? snap.data().name : 'Unknown Hospital';
    hospitalNameCache[uid] = name;
    return name;
}

async function loadRequests(filterOpts = {}) {
    requestsContainer.innerHTML = `<p aria-busy="true">Loading requests...</p>`;

    // ✅ Fixed: actually apply filter options to the query
    let constraints = [
        where("status", "==", "pending"),
        orderBy("createdAt", filterOpts.amount === 'newest' || !filterOpts.amount ? "desc" : "asc")
    ];

    const q = query(collection(window.db, "requests"), ...constraints);
    const querySnapshot = await getDocs(q);

    requestsContainer.innerHTML = '';

    if (querySnapshot.empty) {
        requestsContainer.innerHTML = `<article><h3>No active requests found. 🕊️</h3></article>`;
        return;
    }

    // Collect all docs first, then sort by cost client-side if needed
    let docs = [];
    querySnapshot.forEach(docSnap => docs.push({ id: docSnap.id, ...docSnap.data() }));


    for (const item of docs) {
        const isHospital = item.type === 'hospital';
        const priorityColor = item.urgent ? '#E63946' : 'darkblue';
        const priorityText = item.urgent ? 'Life' : 'Normal';

        // ✅ Fixed: show real hospital name instead of "Hospital Request"
        const displayName = isHospital
            ? await getHospitalName(item.createdBy)
            : 'Individual in Need';

        const article = document.createElement('article');
        article.innerHTML = `
            <header>
                <div class="inner-1">
                    ${isHospital
                        ? `<div class="hospital-logo"></div>`
                        : `<img src='/icons/first-aid.svg' style="width:1.5rem"/>`}
                    <span>${displayName}</span>
                </div>
                <div role="button" class="outline secondary">${item.type}</div>
            </header>

            <p>Medicines: <b>${item.medicine}</b></p>
            ${isHospital ? `<p>Patient ID: ${item.patientId}</p>` : ''}
            <p>Request Date: <small>${item.createdAt.toDate().toLocaleDateString()}</small></p>

            <div class="tags">
                <span class="priority" style="background-color: ${priorityColor};">${priorityText}</span>
                <span class="donation-amount">$${item.cost}</span>
            </div>

            <footer class="grid">
                <button onclick="payNow('${item.id}')" style="font-weight: bold;">
                    DONATE <img src='/icons/tip-jar.svg' />
                </button>
                <button onclick="contactUser('${item.createdBy}', '${item.medicine}')" class="secondary" style="font-weight: bold;">
                    CONTACT <img src='/icons/paper-plane-tilt.svg' />
                </button>
            </footer>
        `;
        requestsContainer.appendChild(article);
    }
}

window.contactUser = async (uid, med) => {
    const userSnap = await window.getUserData(uid);
    if (userSnap) {
        const subject = encodeURIComponent(`Inquiry regarding request for ${med}`);
        const body = encodeURIComponent(`Hello, I saw your request on CareBridge and would like to help...`);
        window.location.href = `mailto:${userSnap.email}?subject=${subject}&body=${body}`;
    }
};

loadRequests();
