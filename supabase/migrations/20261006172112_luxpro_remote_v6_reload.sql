-- v5.36: "Refresh tablet" from the driver's phone reloads the tablet's page.
alter table public.luxpro_command drop constraint if exists luxpro_command_cmd_check;
alter table public.luxpro_command add constraint luxpro_command_cmd_check
  check (cmd in ('new_passenger', 'nearly', 'end_ride', 'end_trip', 'cancel_end', 'vol_up', 'vol_down', 'reload'));
