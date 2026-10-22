# HabitForge backend wiring notes (preview phase, Oct 2026)

## Pieces in this repo
- `supabase/schema.sql` - run once in the Supabase SQL editor (states + entitlements + RLS)
- `api/dodo-webhook.js` - Vercel function; Dodo payment.succeeded -> entitlement row
- `assets/supabase.js` - browser cloud layer (Google-only Supabase Auth, state sync, entitlement check)

## Still to wire after the Supabase project exists
1. Run schema.sql in the project SQL editor.
2. Supabase dashboard > Authentication > Providers > Google: enable, paste Google OAuth client ID + secret.
   Redirect URL to whitelist in the Google Cloud OAuth client: https://<project-ref>.supabase.co/auth/v1/callback
3. Frontend config (new file assets/supabase-config.js, public-safe values only):
   window.HF_SUPABASE_URL / window.HF_SUPABASE_ANON_KEY + the supabase-js v2 CDN script tag on all pages.
4. auth.js: replace the GIS button flow with HFCloud.signInWithGoogle(); keep owner Gmail exemption.
5. core.js save(): also call HFCloud.pushState(S) after localStorage.setItem.
6. billing.js entitled(): also async-check HFCloud.checkEntitlement(email) and grant on hit.
7. Vercel env vars (dashboard, never repo): DODO_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_KEY.
8. Dodo dashboard > Developer > Webhooks: endpoint https://<preview-url>/api/dodo-webhook, subscribe payment.succeeded; copy signing secret into Vercel env.
9. Deploy to a PREVIEW url only (vercel CLI, no --prod). Production swap + ENFORCE flip need Harshit's separate ok.
10. End-to-end proof: one real Rs 149 purchase on the preview build -> webhook -> entitlement -> dashboard unlocks; then refund in Dodo.
