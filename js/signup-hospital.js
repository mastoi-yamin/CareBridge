import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { guard } from '/js/guard.js';

await guard({ access: 'guest' });

async function uploadFile(storage, path, file) {
    if (!file || file.size === 0) return null;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}

const hospitalForm = document.querySelector('form');

hospitalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = hospitalForm.querySelector('[type="submit"]');
    submitBtn.ariaBusy = "true";
    submitBtn.value = "Submitting...";

    const formData = new FormData(hospitalForm);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data['confrim-password']) {
        alert("Passwords do not match!");
        submitBtn.ariaBusy = "false";
        submitBtn.value = "Create Account";
        return;
    }

    const { auth, db } = window;
    const storage = window.storage;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        const folder = `hospitals/${user.uid}`;

        const [legalDocUrl, logoUrl, photo1Url, photo2Url, photo3Url] = await Promise.all([
            uploadFile(storage, `${folder}/legal-doc`, formData.get('docs')),
            uploadFile(storage, `${folder}/logo`,      formData.get('logo')),
            uploadFile(storage, `${folder}/photo-1`,   formData.get('photo-1')),
            uploadFile(storage, `${folder}/photo-2`,   formData.get('photo-2')),
            uploadFile(storage, `${folder}/photo-3`,   formData.get('photo-3')),
        ]);

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: data.name, email: data.email, phone: data.phone,
            country: data.country, city: data.city, address: data.address,
            website: data['website-link'], workers: data['num-workers'],
            beds: data.beds_count, location: data['location-link'],
            role: 'hospital', isApproved: false, isRejected: false,
            appliedAt: new Date(), answers: [data['q-1'], data['q-2']],
            files: { legalDoc: legalDocUrl, logo: logoUrl, photo1: photo1Url, photo2: photo2Url, photo3: photo3Url }
        });

        alert("Application Sent! Please wait for admin approval within 48 hours.");
        window.location.href = "/dashboard";
    } catch (error) {
        alert("Error: " + error.message);
        submitBtn.ariaBusy = "false";
        submitBtn.value = "Create Account";
    }
});
