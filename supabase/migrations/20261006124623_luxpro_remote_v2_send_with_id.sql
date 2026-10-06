-- v5.23: the phone gets the command's id back, and the tablet reports the
-- last id it ran, so the phone can show "Done on the tablet".
create or replace function public.luxpro_phone_send(p_car uuid, p_token text, p_cmd text) returns bigint
language plpgsql security definer set search_path = public, extensions
as $$
declare new_id bigint;
begin
  if not exists (select 1 from luxpro_car where id = p_car and phone_hash = luxpro_hash(p_token)) then
    return null;
  end if;
  insert into luxpro_command (car, cmd) values (p_car, p_cmd) returning id into new_id;
  return new_id;
end $$;
revoke all on function public.luxpro_phone_send(uuid, text, text) from public, authenticated;
grant execute on function public.luxpro_phone_send(uuid, text, text) to anon;
comment on function public.luxpro_phone_send(uuid, text, text) is 'LuxPro remote: public on purpose, every call checks the phone token hash';
