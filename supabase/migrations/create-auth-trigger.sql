-- Create a function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (user_id, email, membership)
  values (
    new.id,
    new.email,
    'free'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to call this function after an insert to auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 