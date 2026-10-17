# HabitForge

Live: https://www.habitforgetracker.in (privacy policy: https://www.habitforgetracker.in/privacy.html)
Static 3-month habit tracker (desktop + mobile). Design from a Stitch export, unchanged. Data lives in localStorage (`habitforge:v1`). Sign-in (Google SSO) gates the app: `index.html` is the sign-in page, the dashboard is `dashboard.html`.

First run starts empty - no seeded habits; each user forges their own in the Daily Tracker. A one-time guided tour (per account, tracked in `habitforge:tour:v1`) walks the dashboard and tracker on first visit. No build step: serve the folder. Workflow docs in `docs/`.
