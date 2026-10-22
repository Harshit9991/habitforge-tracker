-- HabitForge backend schema (Supabase / Postgres). Run in the SQL editor once.
-- One row per user holds the whole tracker state (mirrors the localStorage blob),
-- plus an entitlements table written only by the Dodo webhook (service role).

create table if not exists public.states (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.states enable row level security;

create policy "states: owner read"   on public.states for select using (auth.uid() = user_id);
create policy "states: owner insert" on public.states for insert with check (auth.uid() = user_id);
create policy "states: owner update" on public.states for update using (auth.uid() = user_id);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text not null,
  plan text not null default 'lifetime',
  dodo_payment_id text unique,
  status text not null default 'active',
  granted_at timestamptz not null default now()
);

alter table public.entitlements enable row level security;

-- Buyers can see their own pass. Matched by their signed-in Google email.
create policy "entitlements: read own" on public.entitlements for select
  using (email = lower(auth.jwt() ->> 'email') or user_id = auth.uid());

-- No client writes: inserts/updates come only from the webhook via the service role key.
