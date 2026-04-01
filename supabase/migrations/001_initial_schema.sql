-- initial schema: all tables, indexes and triggers

create extension if not exists "uuid-ossp";

-- users, extends auth.users
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'subscriber' check (role in ('subscriber', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now()
);

-- subscriptions
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  plan text not null check (plan in ('monthly', 'yearly')),
  status text not null default 'lapsed' check (status in ('active', 'cancelled', 'lapsed')),
  current_period_end timestamptz,
  charity_id uuid, -- fk added below after charities table
  charity_percentage numeric not null default 10 check (charity_percentage >= 10 and charity_percentage <= 50),
  created_at timestamptz not null default now()
);

create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_status on public.subscriptions(status);

-- scores (max 5 per user, trigger below handles the rolling window)
create table public.scores (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  stableford_score integer not null check (stableford_score >= 1 and stableford_score <= 45),
  played_at date not null,
  created_at timestamptz not null default now()
);

create index idx_scores_user_id on public.scores(user_id);
create index idx_scores_played_at on public.scores(user_id, played_at desc);

-- keeps only the latest 5 scores per user
create or replace function enforce_rolling_five_scores()
returns trigger as $$
begin
  delete from public.scores
  where id in (
    select id from public.scores
    where user_id = new.user_id
    order by played_at desc, created_at desc
    offset 5
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger rolling_five_scores
  after insert on public.scores
  for each row execute function enforce_rolling_five_scores();

-- charities
create table public.charities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  images jsonb not null default '[]',
  events jsonb not null default '[]',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_charities_slug on public.charities(slug);
create index idx_charities_featured on public.charities(is_featured) where is_featured = true;

-- now we can add the fk on subscriptions
alter table public.subscriptions
  add constraint subscriptions_charity_id_fkey
  foreign key (charity_id) references public.charities(id) on delete set null;

-- charity contributions (logged monthly by cron)
create table public.charity_contributions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  charity_id uuid not null references public.charities(id),
  amount numeric not null check (amount > 0),
  period text not null, -- YYYY-MM
  source text not null check (source in ('subscription', 'voluntary')),
  created_at timestamptz not null default now()
);

create index idx_contributions_period on public.charity_contributions(period);
create index idx_contributions_charity on public.charity_contributions(charity_id);

-- platform config (prize splits, currency, draw range etc.)
create table public.platform_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

insert into public.platform_config (key, value) values
  ('prize_pool_pct', '0.60'),
  ('charity_min_pct', '0.10'),
  ('operating_pct', '0.10'),
  ('currency', 'GBP'),
  ('draw_number_min', '1'),
  ('draw_number_max', '45'),
  ('draw_number_count', '5');

-- draws (one per month, unique constraint prevents duplicates)
create table public.draws (
  id uuid primary key default uuid_generate_v4(),
  month text not null unique, -- YYYY-MM
  status text not null default 'draft' check (status in ('draft', 'simulated', 'published')),
  draw_numbers integer[],
  logic_type text not null default 'random' check (logic_type in ('random', 'weighted')),
  jackpot_carried_forward boolean not null default false,
  jackpot_amount numeric not null default 0,
  created_at timestamptz not null default now(),
  published_at timestamptz
);

-- draw entries, one row per user per draw
create table public.draw_entries (
  id uuid primary key default uuid_generate_v4(),
  draw_id uuid not null references public.draws(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  matched_count integer not null check (matched_count >= 0 and matched_count <= 5),
  tier text not null check (tier in ('5match', '4match', '3match', 'none')),
  unique (draw_id, user_id)
);

create index idx_draw_entries_draw_id on public.draw_entries(draw_id);
create index idx_draw_entries_tier on public.draw_entries(draw_id, tier);

-- prize pool amounts per draw
create table public.prize_pools (
  id uuid primary key default uuid_generate_v4(),
  draw_id uuid not null unique references public.draws(id) on delete cascade,
  total_pool numeric not null default 0,
  five_match_pool numeric not null default 0,
  four_match_pool numeric not null default 0,
  three_match_pool numeric not null default 0,
  jackpot_rollover_amount numeric not null default 0
);

-- temp table for admin simulation previews, cleared on publish
create table public.draw_simulations (
  id uuid primary key default uuid_generate_v4(),
  draw_id uuid not null references public.draws(id) on delete cascade,
  simulated_at timestamptz not null default now(),
  result_snapshot jsonb not null default '{}'
);

create index idx_simulations_draw_id on public.draw_simulations(draw_id);

-- winners (only tiers 3-5match)
create table public.winners (
  id uuid primary key default uuid_generate_v4(),
  draw_id uuid not null references public.draws(id),
  user_id uuid not null references public.users(id),
  tier text not null check (tier in ('5match', '4match', '3match')),
  prize_amount numeric not null check (prize_amount > 0),
  proof_url text,
  verification_status text not null default 'pending' check (verification_status in ('pending', 'approved', 'rejected')),
  payout_status text not null default 'pending' check (payout_status in ('pending', 'paid')),
  admin_notes text,
  verified_at timestamptz,
  paid_at timestamptz
);

create index idx_winners_draw_id on public.winners(draw_id);
create index idx_winners_user_id on public.winners(user_id);
create index idx_winners_verification on public.winners(verification_status);

-- one-off donations (not tied to subscription)
create table public.donations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  charity_id uuid not null references public.charities(id),
  amount numeric not null check (amount > 0),
  stripe_payment_intent_id text,
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed')),
  created_at timestamptz not null default now()
);

create index idx_donations_user_id on public.donations(user_id);
create index idx_donations_charity_id on public.donations(charity_id);
