-- LuxPro v5 · Amish's phone remote (roadmap P8), 2026-10-05.
-- Tables are closed to the public API (RLS on, no policies). The tablet and
-- the phone only call the SECURITY DEFINER functions below, which check a
-- secret: the tablet's own 32+ char secret, or the phone's token issued at
-- pairing. Only SHA-256 hashes of secrets and codes are stored.
-- (Copied from the live project's migration history, 2026-10-06.)

create extension if not exists pgcrypto with schema extensions;

create table public.luxpro_car (
  id            uuid primary key,
  tablet_hash   text not null,
  phone_hash    text,
  pair_hash     text,
  pair_expires  timestamptz,
  state         jsonb not null default '{}'::jsonb,
  state_at      timestamptz,
  created_at    timestamptz not null default now()
);

create table public.luxpro_command (
  id          bigint generated always as identity primary key,
  car         uuid not null references public.luxpro_car(id) on delete cascade,
  cmd         text not null check (cmd in ('new_passenger', 'nearly', 'end_ride')),
  created_at  timestamptz not null default now(),
  done_at     timestamptz
);
create index luxpro_command_pending on public.luxpro_command (car, id) where done_at is null;

alter table public.luxpro_car enable row level security;
alter table public.luxpro_command enable row level security;
revoke all on public.luxpro_car, public.luxpro_command from anon, authenticated;

create or replace function public.luxpro_hash(t text) returns text
language sql immutable set search_path = extensions
as $$ select encode(extensions.digest(t, 'sha256'), 'hex') $$;

-- Tablet: claim a car id the first time, prove it afterwards.
create or replace function public.luxpro_tablet_register(p_car uuid, p_secret text) returns boolean
language plpgsql security definer set search_path = public, extensions
as $$
declare existing text;
begin
  if p_secret is null or length(p_secret) < 32 then return false; end if;
  select tablet_hash into existing from luxpro_car where id = p_car;
  if existing is null then
    insert into luxpro_car (id, tablet_hash) values (p_car, luxpro_hash(p_secret));
    return true;
  end if;
  return existing = luxpro_hash(p_secret);
end $$;

-- Tablet: an 8-character pairing code, valid 10 minutes.
create or replace function public.luxpro_pair_code(p_car uuid, p_secret text) returns text
language plpgsql security definer set search_path = public, extensions
as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  b bytea := extensions.gen_random_bytes(8);
  code text := '';
  i int;
begin
  if not exists (select 1 from luxpro_car where id = p_car and tablet_hash = luxpro_hash(p_secret)) then
    return null;
  end if;
  for i in 0..7 loop
    code := code || substr(alphabet, 1 + (get_byte(b, i) % length(alphabet)), 1);
  end loop;
  update luxpro_car set pair_hash = luxpro_hash(code), pair_expires = now() + interval '10 minutes' where id = p_car;
  return code;
end $$;

-- Phone: trade a valid code for a long-lived token (one phone per car).
create or replace function public.luxpro_phone_pair(p_code text) returns json
language plpgsql security definer set search_path = public, extensions
as $$
declare c uuid; tok text;
begin
  select id into c from luxpro_car
   where pair_hash = luxpro_hash(upper(replace(coalesce(p_code, ''), '-', ''))) and pair_expires > now();
  if c is null then return null; end if;
  tok := encode(extensions.gen_random_bytes(24), 'hex');
  update luxpro_car set phone_hash = luxpro_hash(tok), pair_hash = null, pair_expires = null where id = c;
  return json_build_object('car', c, 'token', tok);
end $$;

-- Phone: send a command (the tablet picks it up within a few seconds).
create or replace function public.luxpro_phone_command(p_car uuid, p_token text, p_cmd text) returns boolean
language plpgsql security definer set search_path = public, extensions
as $$
begin
  if not exists (select 1 from luxpro_car where id = p_car and phone_hash = luxpro_hash(p_token)) then
    return false;
  end if;
  insert into luxpro_command (car, cmd) values (p_car, p_cmd);
  return true;
end $$;

-- Phone: what the tablet last reported.
create or replace function public.luxpro_phone_state(p_car uuid, p_token text) returns json
language plpgsql security definer set search_path = public, extensions
as $$
declare r luxpro_car;
begin
  select * into r from luxpro_car where id = p_car and phone_hash = luxpro_hash(p_token);
  if r.id is null then return null; end if;
  return json_build_object('state', r.state, 'state_at', r.state_at, 'now', now());
end $$;

-- Tablet, every few seconds: report state, collect commands from the last 2 minutes.
create or replace function public.luxpro_tablet_sync(p_car uuid, p_secret text, p_state jsonb) returns json
language plpgsql security definer set search_path = public, extensions
as $$
declare cmds json; paired boolean;
begin
  update luxpro_car set state = coalesce(p_state, '{}'::jsonb), state_at = now()
   where id = p_car and tablet_hash = luxpro_hash(p_secret)
   returning phone_hash is not null into paired;
  if not found then return null; end if;
  with picked as (
    update luxpro_command set done_at = now()
     where car = p_car and done_at is null and created_at > now() - interval '2 minutes'
     returning id, cmd
  )
  select coalesce(json_agg(json_build_object('id', id, 'cmd', cmd) order by id), '[]'::json) into cmds from picked;
  return json_build_object('commands', cmds, 'paired', paired);
end $$;

-- Tablet: forget the paired phone.
create or replace function public.luxpro_tablet_unpair(p_car uuid, p_secret text) returns boolean
language plpgsql security definer set search_path = public, extensions
as $$
begin
  update luxpro_car set phone_hash = null, pair_hash = null, pair_expires = null
   where id = p_car and tablet_hash = luxpro_hash(p_secret);
  return found;
end $$;

revoke all on function public.luxpro_hash(text) from public, anon, authenticated;
revoke all on function public.luxpro_tablet_register(uuid, text), public.luxpro_pair_code(uuid, text),
  public.luxpro_phone_pair(text), public.luxpro_phone_command(uuid, text, text), public.luxpro_phone_state(uuid, text),
  public.luxpro_tablet_sync(uuid, text, jsonb), public.luxpro_tablet_unpair(uuid, text) from public;
grant execute on function public.luxpro_tablet_register(uuid, text), public.luxpro_pair_code(uuid, text),
  public.luxpro_phone_pair(text), public.luxpro_phone_command(uuid, text, text), public.luxpro_phone_state(uuid, text),
  public.luxpro_tablet_sync(uuid, text, jsonb), public.luxpro_tablet_unpair(uuid, text) to anon;
