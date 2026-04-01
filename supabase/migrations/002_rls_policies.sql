-- rls policies for all tables

alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.scores enable row level security;
alter table public.charities enable row level security;
alter table public.charity_contributions enable row level security;
alter table public.platform_config enable row level security;
alter table public.draws enable row level security;
alter table public.draw_entries enable row level security;
alter table public.prize_pools enable row level security;
alter table public.draw_simulations enable row level security;
alter table public.winners enable row level security;
alter table public.donations enable row level security;

-- reusable admin check
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- users
create policy "users: read own profile"
  on public.users for select
  using (id = auth.uid() or is_admin());

create policy "users: update own profile"
  on public.users for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = 'subscriber'); -- can't self-promote to admin

create policy "users: admin full access"
  on public.users for all
  using (is_admin());

-- subscriptions
create policy "subscriptions: read own"
  on public.subscriptions for select
  using (user_id = auth.uid() or is_admin());

create policy "subscriptions: admin full access"
  on public.subscriptions for all
  using (is_admin());

-- scores
create policy "scores: read own"
  on public.scores for select
  using (user_id = auth.uid() or is_admin());

create policy "scores: insert own"
  on public.scores for insert
  with check (user_id = auth.uid());

create policy "scores: update own"
  on public.scores for update
  using (user_id = auth.uid());

create policy "scores: delete own"
  on public.scores for delete
  using (user_id = auth.uid() or is_admin());

create policy "scores: admin full access"
  on public.scores for all
  using (is_admin());

-- charities: anyone can read active ones, admin writes
create policy "charities: public read active"
  on public.charities for select
  using (is_active = true or is_admin());

create policy "charities: admin full access"
  on public.charities for all
  using (is_admin());

-- charity contributions
create policy "contributions: read own"
  on public.charity_contributions for select
  using (user_id = auth.uid() or is_admin());

create policy "contributions: admin full access"
  on public.charity_contributions for all
  using (is_admin());

-- platform config: all authenticated users can read, only admin writes
create policy "platform_config: public read"
  on public.platform_config for select
  to authenticated
  using (true);

create policy "platform_config: admin write"
  on public.platform_config for all
  using (is_admin());

-- draws: published ones are visible to everyone, admin sees all
create policy "draws: read published"
  on public.draws for select
  using (status = 'published' or is_admin());

create policy "draws: admin full access"
  on public.draws for all
  using (is_admin());

-- draw entries
create policy "draw_entries: read own"
  on public.draw_entries for select
  using (user_id = auth.uid() or is_admin());

create policy "draw_entries: admin full access"
  on public.draw_entries for all
  using (is_admin());

-- prize pools: all authenticated can read
create policy "prize_pools: public read"
  on public.prize_pools for select
  to authenticated
  using (true);

create policy "prize_pools: admin full access"
  on public.prize_pools for all
  using (is_admin());

-- draw simulations: admin only
create policy "draw_simulations: admin only"
  on public.draw_simulations for all
  using (is_admin());

-- winners
create policy "winners: read own"
  on public.winners for select
  using (user_id = auth.uid() or is_admin());

create policy "winners: update own proof"
  on public.winners for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "winners: admin full access"
  on public.winners for all
  using (is_admin());

-- donations
create policy "donations: read own"
  on public.donations for select
  using (user_id = auth.uid() or is_admin());

create policy "donations: insert own"
  on public.donations for insert
  with check (user_id = auth.uid());

create policy "donations: admin full access"
  on public.donations for all
  using (is_admin());
