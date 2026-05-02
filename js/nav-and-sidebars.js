import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const authNav = document.getElementById('auth-ui-nav');
const authSide = document.getElementById('auth-ui-side');

const userIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.5rem; height: 1.5rem; color: currentColor" viewBox="0 0 256 256"><rect fill="none"/><circle cx="128" cy="96" r="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M32,216c19.37-33.47,54.55-56,96-56s76.63,22.53,96,56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
    `
    
const plusIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.1rem; height: 1.1rem; color: currentColor" viewBox="0 0 256 256"><rect fill="none"/><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="128" y1="40" x2="128" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
`

const questionIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; color: currentColor" viewBox="0 0 256 256"><rect  fill="none"/><path d="M128,160V144c30.93,0,56-21.49,56-48s-25.07-48-56-48S72,69.49,72,96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><circle cx="128" cy="208" r="16"/></svg>
`

const hospitalIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="hospital-icon"><rect fill="none"/><line x1="32" y1="216" x2="248" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M48,216V48a8,8,0,0,1,8-8h96a8,8,0,0,1,8,8V216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M160,120h64a8,8,0,0,1,8,8v88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="104" y1="72" x2="104" y2="120" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="80" y1="96" x2="128" y2="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="128 216 128 160 80 160 80 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
`
const homeIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" class="hospital-icon" style="width: 1.5rem; height: 1.5rem" viewBox="0 0 256 256"><rect  fill="none"/><path d="M104,216V152h48v64h64V120a8,8,0,0,0-2.34-5.66l-80-80a8,8,0,0,0-11.32,0l-80,80A8,8,0,0,0,40,120v96Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
` 

onAuthStateChanged(window.auth, async (user) => {
  if (user) {
    // 1. Fetch User Role
    const userData = await window.getUserData(user.uid);
    const role = userData?.role || 'donor';
    localStorage.setItem('userRole', role);

    // 2. Define the Logged-In UI for both locations
    
    const navDropdown = `
      <details class="dropdown">
        <summary class="secondary">${userIcon} Account</summary>
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
          link.innerHTML = `How it works ${questionIcon}`;
        } else if (role === 'hospital') {
          link.href = "/requests/new/hospital";
          link.innerHTML = `New Request ${plusIcon}`;
        } else {
          link.href = "/requests/new/individual";
          link.innerHTML = `Request Aid ${plusIcon}`;
        }
      } 
      
      if (linkText.includes("hospital portal")) {
        link.href = "/dashboard";
        link.innerHTML = role === 'hospital' ? `Dashboard ${hospitalIcon}` : `Dashboard ${homeIcon}`;
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
    const loginBtnHTML = `<a role="button" href="/login" style="width: 100%;">Login ${userIcon}</a>`;
    if (authNav) authNav.innerHTML = `<a role="button" href="/login">Login ${userIcon}</a>`;
    if (authSide) authSide.innerHTML = loginBtnHTML;
    
    localStorage.clear();
  }
});
