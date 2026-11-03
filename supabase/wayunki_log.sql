-- Shared tuning log for the Soft Pulse app (applied to Supabase project "softpulse", eu-central-1)
create table public.wayunki_log (
  id        text primary key check (char_length(id) between 4 and 40),
  started   timestamptz not null,
  updated   timestamptz not null,
  deleted   boolean not null default false,
  device    text check (device is null or char_length(device) <= 40),
  data      jsonb not null check (jsonb_typeof(data) = 'object' and pg_column_size(data) < 200000),
  at        timestamptz not null default now()
);
create index wayunki_log_at_idx on public.wayunki_log (at);
create function public.wayunki_log_touch() returns trigger
language plpgsql set search_path = '' as $$ begin new.at := now(); return new; end $$;
create trigger wayunki_log_touch before insert or update on public.wayunki_log
for each row execute function public.wayunki_log_touch();
alter table public.wayunki_log enable row level security;
create policy "app can read"   on public.wayunki_log for select to anon, authenticated using (true);
create policy "app can add"    on public.wayunki_log for insert to anon, authenticated with check (true);
create policy "app can update" on public.wayunki_log for update to anon, authenticated using (true) with check (true);
grant select, insert, update on public.wayunki_log to anon, authenticated;
revoke delete, truncate on public.wayunki_log from anon, authenticated;
