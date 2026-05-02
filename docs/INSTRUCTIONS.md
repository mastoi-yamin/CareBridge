# 🛠️ CareBridge Demo: Mock Data Instructions

The platform is equipped with an **Auto-Seeder** that primes the database on the first visit. 
Use these steps to navigate the demo like a pro.

### 1. The "First Visit" Effect

- When you open the site for the first time, look at the browser console (F12). 
- You will see: `🛠️ First-time visit detected. Priming demo data...`
- The database is now populated with mock Hospitals, Donors, and Requests.

### 2. Demo Login Credentials

*Use the password **`password123`** for all accounts below:*

| Role | Email | Purpose |
| :--- | :--- | :--- |
| **Admin** | `admin@carebridge.com` | Verify hospitals & manage platform. |
| **Hospital** | `contact@cityhope.org` | Post bulk medicine requests for patients. |
| **Individual** | `john@example.com` | Post direct personal aid requests. |
| **Donor** | `sarah@donor.com` | Fund requests and view impact history. |

### 3. Step-by-Step Demo Flow

1. **Browse:** Navigate to `/requests` to see the live feed of mock data.
2. **Donate:** Click **"DONATE"** on any card. 
   - *Result:* You'll see a loading state (simulating a bank API) followed by a success message.
3. **Verify:** Check the **Dashboard**. The request you just funded will now appear in your impact history.

### 4. How to Reset the Database

If you want to clear everything and start the demo fresh for a new presentation:
1. Open DevTools (**F12**) -> **Application** tab.
2. Select **Local Storage** on the left.
3. Click **"Clear All"** (the 🚫 icon).
4. **Refresh the page.** The system will re-seed a clean set of data immediately.
