-- v5.31: two-phase hand-over. A command is marked done only once the tablet
-- reports (p_ack) that it ran it, so a reply lost on a bad signal is sent
-- again on the next check-in instead of vanishing. The tablet skips ids it
-- has already run. Also tidies this car's commands older than a day.
create or replace function public.luxpro_tablet_sync2(p_car uuid, p_secret text, p_state jsonb, p_ack bigint) returns json
language plpgsql security definer set search_path = public, extensions
as $$
declare cmds json; paired boolean;
begin
  update luxpro_car set state = coalesce(p_state, '{}'::jsonb), state_at = now()
   where id = p_car and tablet_hash = luxpro_hash(p_secret)
   returning phone_hash is not null into paired;
  if not found then return null; end if;
  update luxpro_command set done_at = now()
   where car = p_car and done_at is null and id <= coalesce(p_ack, 0);
  delete from luxpro_command where car = p_car and created_at < now() - interval '1 day';
  select coalesce(json_agg(json_build_object('id', id, 'cmd', cmd) order by id), '[]'::json) into cmds
    from luxpro_command
   where car = p_car and done_at is null and id > coalesce(p_ack, 0)
     and created_at > now() - interval '2 minutes';
  return json_build_object('commands', cmds, 'paired', paired);
end $$;
revoke all on function public.luxpro_tablet_sync2(uuid, text, jsonb, bigint) from public, authenticated;
grant execute on function public.luxpro_tablet_sync2(uuid, text, jsonb, bigint) to anon;
comment on function public.luxpro_tablet_sync2(uuid, text, jsonb, bigint) is 'LuxPro remote: public on purpose, every call checks the tablet secret hash';
