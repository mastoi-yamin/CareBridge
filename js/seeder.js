import { collection, addDoc, setDoc, doc, getDocs, limit, query } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export async function autoSeed() {
    console.log("🔥 Firebase initialized. Calling seeder...");
    if (localStorage.getItem('db_primed') === "true") {
        console.log("ℹ️ Database already primed. Skipping seeder.");
        return;
    }
    
    const q = query(collection(window.db, "requests"), limit(1));
    const snapshot = await getDocs(q);

    console.log("Priming full demo environment...");

    try {
        // 1. MOCK USERS FOR EVERY ROLE
        const users = [
            { 
                id: "demo-admin", 
                data: { name: "CareBridge Admin", role: "admin", email: "admin@carebridge.com" } 
            },
            { 
                id: "demo-hosp", 
                data: { name: "City Hope Hospital", role: "hospital", email: "contact@cityhope.org", isApproved: true } 
            },
            { 
                id: "demo-hosp-pending", 
                data: { name: "Rural Clinic X", role: "hospital", email: "verify@ruralx.org", isApproved: false } 
            },
            { 
                id: "demo-donor", 
                data: { name: "Sarah Jenkins", role: "donor", email: "sarah@donor.com" } 
            },
            { 
                id: "demo-individual", 
                data: { name: "John Doe", role: "individual", email: "john@example.com" } 
            }
        ];

        for (const u of users) {
            await setDoc(doc(window.db, "users", u.id), u.data);
        }

        // 2. MOCK REQUESTS TO SHOW VARIOUS STATES
        const requests = [
            {
                medicine: "Chemotherapy Cycle 1 - Doxorubicin",
                cost: 450,
                type: "individual",
                status: "pending",
                urgent: true,
                createdAt: new Date(),
                createdBy: "demo-individual",
                description: "Patient needs urgent first cycle support."
            },
            {
                medicine: "Insulin Glargine (Bulk Supply)",
                cost: 1200,
                type: "hospital",
                status: "pending",
                urgent: false,
                hospitalName: "City Hope Hospital",
                patientId: "HOSP-9921",
                createdAt: new Date(),
                createdBy: "demo-hosp"
            },
            {
                medicine: "Pediatric Antibiotics",
                cost: 65,
                type: "individual",
                status: "funded",
                fundedBy: "demo-donor",
                createdAt: new Date(Date.now() - 86400000), // Yesterday
                createdBy: "demo-individual"
            }
        ];

        for (const r of requests) {
            await addDoc(collection(window.db, "requests"), r);
        }

        localStorage.setItem('db_primed', 'true');
        console.log("Demo environment primed with all roles!");
    } catch (err) {
        console.error("Seeding failed:", err);
    }
}
