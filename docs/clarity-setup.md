# Microsoft Clarity setup log

Date: 2026-10-24 (IST)

## What was done

- Signed in to Microsoft Clarity with Google single sign-on (personal Gmail account).
- Created a new Clarity project:
  - Name: HabitForge
  - Website URL: https://www.habitforgetracker.in/
  - Industry: Other
  - Project ID: z2tmivhxug (this is the public tracking ID and is safe to share)
  - Dashboard: https://clarity.microsoft.com/projects/view/z2tmivhxug/gettingstarted (the bare /projects/view/z2tmivhxug URL without a subpage shows a Clarity error page)
- Sensitive-data rules (verified against the Clarity Terms of Use accepted at signup, https://clarity.microsoft.com/terms):
  - The Terms prohibit using Clarity "in connection with content which may contain sensitive user materials, such as health care, financial services or government-related information" (Section 1(b)(ii)) and bar knowingly disclosing GDPR-defined Sensitive Data, which includes health data, to Microsoft (Section 4.4(c)(ii)).
  - These restrictions apply regardless of the industry category chosen at setup, so picking "Other" is not an exemption. Habit names and reflections can touch health topics, which is why masking is mandatory before any install (see below).
  - The Terms also require the site's privacy notice to disclose that third parties such as Microsoft collect personal data from visitors, and to link the Microsoft Privacy Statement (Section 4.4(b)). EEA/UK/Switzerland visitors require cookie consent (Section 4.4(d)).
- Generated a dedicated Data Export API token (token name: `habitforge-export`) under Settings > Data export. This is a separate credential from the public tracking project ID.
  - Export endpoint: `www.clarity.ms/export-data/api/v1/project-live-insights`
  - Clarity limits export API calls to 10 per project per day.
- The export token is stored in the owner's password vault. It is not committed to this repository and must never be.

## Verified

- Project exists and loads in the Clarity dashboard.
- Token row `habitforge-export` is listed under Settings > Data export.

## Not done yet

- The Clarity tracking script is NOT installed on the site yet. Project creation alone does not track anything.
- When installed, masking must be on for habit names and reflection text (`data-clarity-mask` attributes are staged locally, not deployed). Masked content is never uploaded to Clarity. Clarity masks input boxes and dropdowns in all modes, but the default Balanced mode does NOT mask plain page text, so the `data-clarity-mask` attributes (or Strict masking mode) are what keep habit/reflection content out of Clarity. Masking is not retroactive.
- `privacy.html` still says the site uses no analytics or tracking cookies; that wording needs updating before Clarity goes live.
