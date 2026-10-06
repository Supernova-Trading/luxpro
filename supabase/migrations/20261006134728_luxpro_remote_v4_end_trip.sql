-- v5.26: "End trip" starts the drop-off chain (nearly there now, thank-you
-- screen 2 minutes later); "cancel_end" stops it.
alter table public.luxpro_command drop constraint if exists luxpro_command_cmd_check;
alter table public.luxpro_command add constraint luxpro_command_cmd_check
  check (cmd in ('new_passenger', 'nearly', 'end_ride', 'end_trip', 'cancel_end', 'vol_up', 'vol_down'));
