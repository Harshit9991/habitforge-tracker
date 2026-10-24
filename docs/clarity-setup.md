# Microsoft Clarity setup log

Date: 2026-10-24 (IST)

## What was done

- Signed in to Microsoft Clarity with Google single sign-on (personal Gmail account).
- Created a new Clarity project:
  - Name: HabitForge
  - Website URL: https://www.habitforgetracker.in/
  - Industry: Other
  - Project ID: z2tmivhxug (this is the public tracking ID and is safe to share)
  - Dashboard: https://clarity.microsoft.com/projects/view/z2tmivhxug
- Industry note: the Health & Wellness category prompts an Additional Terms agreement about sensitive data. Chose "Other" for now; revisit if a different category is ever needed.
- Generated a dedicated Data Export API token (token name: `habitforge-export`) under Settings > Data export. This is a separate credential from the public tracking project ID.
  - Export endpoint: `www.clarity.ms/export-data/api/v1/project-live-insights`
  - Clarity limits export API calls to 10 per project per day.
- The export token is stored in the owner's password vault. It is not committed to this repository and must never be.

## Verified

- Project exists and loads in the Clarity dashboard.
- Token row `habitforge-export` is listed under Settings > Data export.

## Not done yet

- The Clarity tracking script is NOT installed on the site yet. Project creation alone does not track anything.
- When installed, masking must be on for habit names and reflection text (`data-clarity-mask` attributes are staged locally, not deployed).
- `privacy.html` still says the site uses no analytics or tracking cookies; that wording needs updating before Clarity goes live.
