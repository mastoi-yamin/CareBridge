import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/**
 * @param {object} opts
 * @param {'guest'|'auth'} opts.access  - 'guest' = logged-out only, 'auth' = logged-in only
 * @param {string[]} [opts.roles]       - if set, only these roles can access (ignored for guest pages)
 * @param {boolean} [opts.approvedOnly] - if true, unapproved hospitals get bounced
 */
export function guard(opts = {}) {
    return new Promise(async (resolve) => {
        await window._authReady; // ✅ wait for Firebase to be ready
        onAuthStateChanged(window.auth, async (user) => {

            // --- GUEST-ONLY PAGES (login, signup) ---
            if (opts.access === 'guest') {
                if (user) {
                    // Already logged in → go to dashboard
                    window.location.href = '/dashboard';
                    return;
                }
                resolve(); // Not logged in → allow
                return;
            }

            // --- AUTH-REQUIRED PAGES ---
            if (!user) {
                window.location.href = '/login';
                return;
            }

            const userData = await window.getUserData(user.uid);
            const role = userData?.role;

            // Role whitelist check
            if (opts.roles && !opts.roles.includes(role)) {
                window.location.href = '/dashboard';
                return;
            }

            // Approved-only check (for hospital request page)
            if (opts.approvedOnly && role === 'hospital' && !userData.isApproved) {
                window.location.href = '/dashboard';
                return;
            }

            // All checks passed → resolve with user data so page JS can use it
            resolve({ user, userData });
        });
    });
}
