
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text not null default 'cliente' check (role in ('admin','vendedor','cliente')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_self" on public.profiles for select using (auth.uid() = user_id);
create policy "profiles_admin_all" on public.profiles for all using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin'));

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  color text,
  description text,
  active boolean not null default true,
  logo_url text,
  bank_alias text,
  bank_cbu text,
  mp_access_token text,
  created_at timestamptz not null default now()
);
alter table public.brands enable row level security;
create policy "brands_read_active" on public.brands for select using (active = true);
create policy "brands_admin_all" on public.brands for all using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role='admin'));
create policy "brands_vendor_update" on public.brands for update using (exists (select 1 from public.brand_users bu where bu.brand_id = brands.id and bu.user_id = auth.uid()));

create table if not exists public.brand_users (
  brand_id uuid references public.brands(id) on delete cascade,
  user_id uuid references public.profiles(user_id) on delete cascade,
  primary key (brand_id, user_id)
);
alter table public.brand_users enable row level security;
create policy "brand_users_sel" on public.brand_users for select using (auth.uid() is not null);
create policy "brand_users_ins_admin" on public.brand_users for insert with check (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role='admin'));
create policy "brand_users_del_admin" on public.brand_users for delete using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role='admin'));

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  brand_slug text not null,
  name text not null,
  subcat text not null check (subcat in ('remera','pantalon','buzo','campera','otros')),
  price numeric not null default 0,
  stock integer not null default 0,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "products_read_public" on public.products for select using (active = true and exists (select 1 from public.brands b where b.id = products.brand_id and b.active = true));
create policy "products_admin_all" on public.products for all using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role='admin'));
create policy "products_vendor_ins" on public.products for insert with check (exists (select 1 from public.brand_users bu where bu.brand_id = products.brand_id and bu.user_id = auth.uid()));
create policy "products_vendor_upd" on public.products for update using (exists (select 1 from public.brand_users bu where bu.brand_id = products.brand_id and bu.user_id = auth.uid()));
create policy "products_vendor_del" on public.products for delete using (exists (select 1 from public.brand_users bu where bu.brand_id = products.brand_id and bu.user_id = auth.uid()));

create table if not exists public.orders (
  id text primary key,
  user_id uuid references public.profiles(user_id) on delete set null,
  total numeric not null default 0,
  created_at timestamptz not null default now()
);
alter table public.orders enable row level security;

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text references public.orders(id) on delete cascade,
  product_id uuid,
  brand_id uuid references public.brands(id),
  brand_slug text,
  name text,
  price numeric,
  qty integer
);
alter table public.order_items enable row level security;

create table if not exists public.shipping_addresses (
  order_id text primary key references public.orders(id) on delete cascade,
  nombre text, dni text, email text, telefono text,
  domicilio text, provincia text, localidad text, codigo_postal text,
  entre_calles text, observaciones text
);
alter table public.shipping_addresses enable row level security;

create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('order','support')),
  order_id text,
  brand_id uuid references public.brands(id),
  customer_id uuid references public.profiles(user_id),
  status text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz not null default now(),
  expires_at timestamptz generated always as (created_at + interval '90 days') stored
);
alter table public.chats enable row level security;

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references public.chats(id) on delete cascade,
  sender_id uuid,
  sender_role text,
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.chat_messages enable row level security;

create policy "orders_user_ins" on public.orders for insert with check (auth.uid() = user_id or user_id is null);
create policy "orders_user_sel" on public.orders for select using (auth.uid() = user_id);
create policy "orders_admin_all" on public.orders for all using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role='admin'));
create policy "orders_vendor_sel" on public.orders for select using (exists (select 1 from public.order_items oi join public.brand_users bu on bu.brand_id = oi.brand_id where oi.order_id = orders.id and bu.user_id = auth.uid()));

create policy "order_items_user_sel" on public.order_items for select using (exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid()));
create policy "order_items_admin_all" on public.order_items for all using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role='admin'));
create policy "order_items_vendor_sel" on public.order_items for select using (exists (select 1 from public.brand_users bu where bu.brand_id = order_items.brand_id and bu.user_id = auth.uid()));

create policy "shipping_user_sel" on public.shipping_addresses for select using (exists (select 1 from public.orders o where o.id = shipping_addresses.order_id and o.user_id = auth.uid()));
create policy "shipping_admin_all" on public.shipping_addresses for all using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role='admin'));
create policy "shipping_vendor_sel" on public.shipping_addresses for select using (exists (select 1 from public.order_items oi where oi.order_id = shipping_addresses.order_id and exists (select 1 from public.brand_users bu where bu.brand_id = oi.brand_id and bu.user_id = auth.uid())));

create policy "chats_select_participants" on public.chats for select using (
  auth.uid() = customer_id or
  exists (select 1 from public.brand_users bu where bu.brand_id = chats.brand_id and bu.user_id = auth.uid()) or
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role='admin')
);
create policy "chats_insert_customer_or_admin" on public.chats for insert with check (
  auth.uid() is not null and (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role='admin') or
    auth.uid() = customer_id
  )
);
create policy "chats_update_admin_only" on public.chats for update using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role='admin')
);

create policy "chat_messages_select_participants" on public.chat_messages for select using (
  exists (select 1 from public.chats c where c.id = chat_messages.chat_id and (
    auth.uid() = c.customer_id or
    exists (select 1 from public.brand_users bu where bu.brand_id = c.brand_id and bu.user_id = auth.uid()) or
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role='admin')
  ))
);
create policy "chat_messages_insert_by_customer_or_vendor" on public.chat_messages for insert with check (
  exists (select 1 from public.chats c where c.id = chat_messages.chat_id and (
    auth.uid() = c.customer_id or
    exists (select 1 from public.brand_users bu where bu.brand_id = c.brand_id and bu.user_id = auth.uid())
  ))
);
