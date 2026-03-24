create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.enforce_daily_model_limit()
returns trigger
language plpgsql
as $$
declare
  daily_count integer;
  window_start timestamptz;
  window_end timestamptz;
begin
  window_start := date_trunc('day', timezone('utc', now())) at time zone 'utc';
  window_end := window_start + interval '1 day';

  select count(*)
  into daily_count
  from public.models
  where user_id = new.user_id
    and created_at >= window_start
    and created_at < window_end;

  if daily_count >= 5 then
    raise exception 'Daily model limit reached' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

create table if not exists public.models (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  prompt text not null default '',
  style text not null default '',
  provider_path text not null,
  source_mode text not null,
  task_id text not null unique,
  model_url text not null,
  preview_url text not null,
  thumbnail_url text not null,
  format text not null default 'GLB',
  summary text not null default '',
  response_source text not null,
  status text not null default 'completed',
  reference_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.models enable row level security;

drop policy if exists "Models are readable by owner" on public.models;
create policy "Models are readable by owner"
on public.models
for select
using (auth.uid() = user_id);

drop policy if exists "Models are insertable by owner" on public.models;
create policy "Models are insertable by owner"
on public.models
for insert
with check (auth.uid() = user_id);

drop policy if exists "Models are updatable by owner" on public.models;
create policy "Models are updatable by owner"
on public.models
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Models are deletable by owner" on public.models;
create policy "Models are deletable by owner"
on public.models
for delete
using (auth.uid() = user_id);

create index if not exists models_user_id_created_at_idx
  on public.models (user_id, created_at desc);

create index if not exists models_user_id_provider_path_idx
  on public.models (user_id, provider_path);

drop trigger if exists set_models_updated_at on public.models;
create trigger set_models_updated_at
before update on public.models
for each row
execute function public.set_updated_at();

drop trigger if exists enforce_daily_model_limit on public.models;
create trigger enforce_daily_model_limit
before insert on public.models
for each row
execute function public.enforce_daily_model_limit();