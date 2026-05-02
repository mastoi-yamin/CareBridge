import { collection, addDoc, setDoc, doc, getDocs, limit, query } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export async function autoSeed() {
    // 1. Check if we've already seeded this browser
    if (localStorage.getItem('db_primed')) return;

    // 2. Check if the DB actually has data (safety check for live environment)
    const q = query(collection(window.db, "requests"), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
        localStorage.setItem('db_primed', 'true');
        return;
    }

    console.log("🛠️ First-time visit detected. Priming demo data...");

    try {
        // Add Mock Users
        const users = [
            { id: "demo-hosp", data: { name: "St. Jude Medical", role: "hospital", email: "contact@stjude.org", isApproved: true } },
            { id: "demo-donor", data: { name: "Sarah Donor", role: "donor", email: "sarah@gmail.com" } }
        ];

        for (const u of users) {
            await setDoc(doc(window.db, "users", u.id), u.data);
        }

        // Add Mock Requests
        const requests = [
            {
                medicine: "Epinephrine Auto-Injectors (2-Pack)",
                cost: 250,
                type: "individual",
                status: "pending",
                urgent: true,
                createdAt: new Date(),
                createdBy: "demo-hosp"
            },
            {
                medicine: "Standard Dialysis Kit",
                cost: 110,
                type: "hospital",
                status: "funded", // Shows the success state
                fundedBy: "demo-donor",
                createdAt: new Date(Date.now() - 86400000),
                createdBy: "demo-hosp"
            }
        ];

        for (const r of requests) {
            await addDoc(collection(window.db, "requests"), r);
        }

        localStorage.setItem('db_primed', 'true');
        console.log("Demo environment ready.");
    } catch (err) {
        console.error("Seeding failed:", err);
    }
}
