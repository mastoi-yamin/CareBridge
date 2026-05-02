import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const hospitalForm = document.querySelector('form');

hospitalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. Get all data using FormData (Super fast way to get many fields!)
    const formData = new FormData(hospitalForm);
    const data = Object.fromEntries(formData.entries());
    
    if (data.password !== data['confrim-password']) {
        alert("Passwords do not match!");
        return; // Stop the function here
    }
    
    const { auth, db } = window;
    const email = data.email;
    const password = data.password;
    
    try {
        // 2. Create the Auth Account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 3. Save EVERYTHING to Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: data.name,
            email: data.email,
            phone: data.phone,
            country: data.country,
            city: data.city,
            address: data.address,
            website: data['website-link'],
            workers: data['num-workers'],
            beds: data.beds_count,
            location: data['location-link'],
            role: 'hospital',
            isApproved: false, // 👈 ADMINS WILL CHANGE THIS
            appliedAt: new Date(),
            answers: [data['q-1'], data['q-2']]
        });

        alert("Application Sent! Please wait for admin approval.");
        window.location.href = "/dashboard";

    } catch (error) {
        alert("Error: " + error.message);
    }
});
