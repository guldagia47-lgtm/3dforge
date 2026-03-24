create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro', 'premium')),
  status text not null default 'active' check (status in ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'inactive')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_price_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists subscriptions_user_id_unique on public.subscriptions (user_id);
create index if not exists subscriptions_plan_idx on public.subscriptions (plan);
create index if not exists subscriptions_status_idx on public.subscriptions (status);

alter table public.subscriptions enable row level security;

create policy "Users can read their own subscriptions"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own subscriptions"
  on public.subscriptions
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own subscriptions"
  on public.subscriptions
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own subscriptions"
  on public.subscriptions
  for delete
  using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;

create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row
execute procedure public.set_updated_at();