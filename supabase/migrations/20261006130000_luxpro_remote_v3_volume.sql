-- v5.25: Amish can turn the tablet's music up or down from his phone.
alter table public.luxpro_command drop constraint if exists luxpro_command_cmd_check;
alter table public.luxpro_command add constraint luxpro_command_cmd_check
  check (cmd in ('new_passenger', 'nearly', 'end_ride', 'vol_up', 'vol_down'));
