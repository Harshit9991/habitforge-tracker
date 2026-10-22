/* HabitForge Dodo webhook receiver (Vercel serverless function).
   Dodo -> POST /api/dodo-webhook on payment.succeeded -> upsert entitlement.
   Env (Vercel project settings, NEVER in the repo):
     DODO_WEBHOOK_SECRET   - from Dodo dashboard > Developer > Webhooks
     SUPABASE_URL          - https://<project-ref>.supabase.co
     SUPABASE_SERVICE_KEY  - service_role key (server-side only) */
const crypto = require('crypto');

const CRUCIBLE_PRODUCT_ID = 'pdt_0NqHv2GHWEkdXBD90yHOT';

function verifyDodoSignature(secret, id, timestamp, signature, rawBody) {
  // Standard webhooks: signature = base64( HMAC_SHA256(secret, `${id}.${timestamp}.${body}`) )
  // Header carries space-separated "v1,<sig>" pairs.
  const expected = crypto
    .createHmac('sha256', Buffer.from(secret.replace(/^whsec_/, ''), 'base64'))
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest('base64');
  return (signature || '').split(' ').some((entry) => {
    const [, sig] = entry.split(',');
    return sig && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const rawBody = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

  const id = req.headers['webhook-id'];
  const timestamp = req.headers['webhook-timestamp'];
  const signature = req.headers['webhook-signature'];
  const secret = process.env.DODO_WEBHOOK_SECRET;
  if (!secret || !id || !timestamp || !signature) return res.status(400).json({ error: 'missing signature' });

  let valid = false;
  try { valid = verifyDodoSignature(secret, id, timestamp, signature, rawBody); } catch (e) { valid = false; }
  if (!valid) return res.status(401).json({ error: 'invalid signature' });

  let event;
  try { event = JSON.parse(rawBody); } catch (e) { return res.status(400).json({ error: 'bad json' }); }
  if (event.type !== 'payment.succeeded') return res.status(200).json({ ignored: event.type || 'unknown' });

  const p = event.data || {};
  // Dodo sends purchased items in data.product_cart; keep a top-level product_id fallback.
  const cart = Array.isArray(p.product_cart) ? p.product_cart : [];
  const hasCrucible = p.product_id === CRUCIBLE_PRODUCT_ID ||
    cart.some((i) => i && i.product_id === CRUCIBLE_PRODUCT_ID);
  if (!hasCrucible) return res.status(200).json({ ignored: 'other product' });

  const email = (p.customer && p.customer.email || '').toLowerCase();
  const paymentId = p.payment_id || null;
  if (!email || !paymentId) return res.status(400).json({ error: 'missing customer email or payment id' });

  const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/entitlements`, {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates'
    },
    body: JSON.stringify({ email, dodo_payment_id: paymentId, plan: 'lifetime', status: 'active' })
  });
  if (!r.ok) return res.status(502).json({ error: 'supabase write failed', detail: await r.text() });
  return res.status(200).json({ ok: true });
};
