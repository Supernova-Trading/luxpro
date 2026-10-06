-- Only the public (anon) key is used by LuxPro; signed-in users don't exist here.
revoke execute on function public.luxpro_tablet_register(uuid, text), public.luxpro_pair_code(uuid, text),
  public.luxpro_phone_pair(text), public.luxpro_phone_command(uuid, text, text), public.luxpro_phone_state(uuid, text),
  public.luxpro_tablet_sync(uuid, text, jsonb), public.luxpro_tablet_unpair(uuid, text) from authenticated;
comment on function public.luxpro_tablet_sync(uuid, text, jsonb) is 'LuxPro remote: public on purpose, every call checks the tablet secret hash';
comment on function public.luxpro_phone_command(uuid, text, text) is 'LuxPro remote: public on purpose, every call checks the phone token hash';
