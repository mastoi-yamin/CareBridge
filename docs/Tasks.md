# CareBridge Tasks

## Authentication & Users
- [X] 1. Login page (email/password)
- [X] 2. Signup page (email/password + role selection: donor/individual/hospital)
- [X] 3. Hospital registration form (long form: name, country, city, address, establishment date, website, email, phone, workers count, Google Maps link, legal docs PDF, logo, manager photo, exterior photo, interior photo, questions, checkboxes) 
- [X] 4. Admin approval page for pending hospitals
- [X] 5. Role-based access control (admin/donor/individual/hospital)

## Navigation & UI
- [X] 6. Responsive navbar
- [X] 7. Replace login button with profile icon if logged in 
- [X] 8. Footer (all pages)
- [X] 9. Loading states for requests
- [X] 10. Mobile menu

## Pages
- [X] 12. Homepage (hero, description, why, how it works, get started)
- [X] 13. About page (mission, UNSDG3 alignment)

## Request Forms
- [X] 14. Individual request form (medicine name, cost, country, city, pharmacy Google Maps, pharmacy name, WhatsApp/Telegram, bill upload, urgent checkbox, swear checkbox + legal warning)
- [X] 15. Hospital request form (anonymous patient ID, medicines, quantities, total cost, bill upload with blur instructions, urgent checkbox)

## Requests & Donations
- [X] 16. Browse requests page (`/requests`) — list all pending requests
- [X] 17. Request detail page — full info + pay button
- [X] 18. Donate functionality (payment integration — Stripe/PayPal dummy or real)
- [X] 19. Mark request as "funded" after payment
- [X] 20. Partial payments (request stays open until fully funded)

## Dashboards
- [X] 21. Homepage dynamic content — check user role (logged in? which role? show corresponding dashboard or default)
- [X] 22. Donor dashboard — past donations
- [X] 23. Individual dashboard — their requests (pending/funded/completed)
- [X] 24. Hospital dashboard — their patient requests + status
- [X] 27. Admin dashboard — pending hospitals + reported requests

## Database Models
- [X] 28. User (email, password, name, role, phone, etc.)
- [X] 29. Hospital (all registration fields + verification status)
- [X] 30. Request (patient ID, medicines, quantities, total cost, bill photo, status, type, created by, donor, etc.)
- [X] 31. Donation model (amount, request ID, donor ID, timestamp)

## Privacy & Legal
- [X] 32. Bill upload instruction: "Blur your name and face. Keep medicine names + stamp visible."
- [X] 33. Swear checkbox on all request forms (legal warning: fake = police involved)
- [X] 34. Hospital verification photos stored securely (never public)

## Testing & Data
- [X] Seed fake data for testing (hospitals, requests, donors)
- [X] Form validation (frontend + backend)

## Deployment
- [X] Frontend deploy (Netlify)
- [X] Environment variables setup

## Additional
- [X] Fully responsive web design for all pages
- [X] 404 page

