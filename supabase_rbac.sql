-- Supabase RBAC schema for Cikarawang Farm

-- 1. Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'pelanggan' check (role in ('pelanggan','admin','owner')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can select their own profile"
  on public.profiles
  for select
  using (id = auth.uid());

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- 2. Trigger function for automatic profile creation
create or replace function public.create_profile_on_signup()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.user_metadata ->> 'full_name',
    coalesce(new.user_metadata ->> 'role', 'pelanggan')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger create_profile_after_signup
after insert on auth.users
for each row
execute procedure public.create_profile_on_signup();

-- 3. Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  product_type text not null check (product_type in ('paket_aqiqah','domba','pupuk')),
  stock int not null default 0,
  price numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Helper to read current user role
create or replace function public.current_user_role()
returns text stable
language sql
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- 5. Enable RLS and policies for products
alter table public.products enable row level security;

create policy "Select products for authenticated roles"
  on public.products
  for select
  using (
    public.current_user_role() in ('pelanggan', 'admin', 'owner')
  );

create policy "Admins can insert products"
  on public.products
  for insert
  with check (
    public.current_user_role() = 'admin'
  );

create policy "Admins can update products"
  on public.products
  for update
  using (
    public.current_user_role() = 'admin'
  )
  with check (
    public.current_user_role() = 'admin'
  );

create policy "Admins can delete products"
  on public.products
  for delete
  using (
    public.current_user_role() = 'admin'
  );
