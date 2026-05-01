import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const authNav = document.getElementById('auth-ui-nav');
const authSide = document.getElementById('auth-ui-side');

onAuthStateChanged(window.auth, async (user) => {
  if (user) {
    // 1. Fetch User Role
    const userData = await window.getUserData(user.uid);
    const role = userData?.role || 'donor';
    localStorage.setItem('userRole', role);

    // 2. Define the Logged-In UI for both locations
    const navDropdown = `
      <details class="dropdown">
        <summary class="secondary">👤 Account</summary>
        <ul dir="rtl">
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="#" class="logout-trigger">Logout</a></li>
        </ul>
      </details>
    `;

    const sideLinks = `
      <a href="/dashboard" role="button" style="width: 100%; margin-bottom: 10px;">Dashboard</a>
      <a href="#" class="logout-trigger" role="button" class="contrast outline" style="width: 100%; color: var(--pico-error-color);">Logout</a>
    `;

    // Inject the UI
    if (authNav) authNav.innerHTML = navDropdown;
    if (authSide) authSide.innerHTML = sideLinks;

    // 3. Update all "Need Help" and "Portal" links in the entire DOM
    // This targets every <a> that currently points to /login
    const allLinks = document.querySelectorAll('a[href="/login"]');
    
    allLinks.forEach(link => {
      const linkText = link.innerText.toLowerCase();

      if (linkText.includes("help")) {
        if (role === 'donor') {
          // Hide "Need Help" for donors, or point to "How it works"
          link.href = "/about";
          link.innerHTML = `How it works ❓`;
        } else if (role === 'hospital') {
          link.href = "/requests/new/hospital";
          link.innerHTML = `New Request <img src="/icons/plus.svg" style="width:1rem"/>`;
        } else {
          link.href = "/requests/new/individual";
          link.innerHTML = `Request Aid <img src="/icons/plus.svg" style="width:1rem"/>`;
        }
      } 
      
      if (linkText.includes("hospital portal")) {
        link.href = "/dashboard";
        link.innerHTML = role === 'hospital' ? "Hospital Dashboard 🏥" : "Dashboard 🏠";
      }
    });

    // 4. Logout Logic (Universal trigger)
    const handleLogout = async (e) => {
      e.preventDefault();
      await signOut(window.auth);
      localStorage.clear();
      window.location.href = "/";
    };

    // Attach to all logout triggers (Nav + Side)
    document.querySelectorAll('.logout-trigger').forEach(btn => {
      btn.addEventListener('click', handleLogout);
    });

  } else {
    // 5. Reset to logged-out state
    const loginBtnHTML = `<a role="button" href="/login" style="width: 100%;">Login <img src='/icons/user.svg' /></a>`;
    if (authNav) authNav.innerHTML = `<a role="button" href="/login">Login <img src='/icons/user.svg' /></a>`;
    if (authSide) authSide.innerHTML = loginBtnHTML;
    
    localStorage.clear();
  }
});
