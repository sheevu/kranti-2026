-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table if not exists users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  full_name text,
  role text default 'user', -- 'admin', 'user'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CUSTOMERS TABLE
create table if not exists customers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text,
  city text,
  address text,
  balance numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INVOICES TABLE
create table if not exists invoices (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references customers(id) on delete cascade not null,
  invoice_date date default current_date not null,
  total_amount numeric default 0 not null,
  items jsonb default '[]'::jsonb, -- Array of objects: { name, quantity, price }
  status text default 'unpaid', -- 'paid', 'unpaid', 'cancelled'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PAYMENTS TABLE
create table if not exists payments (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references customers(id) on delete cascade not null,
  amount numeric not null,
  payment_date date default current_date not null,
  method text default 'cash', -- 'cash', 'upi', 'bank'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Leads / Products (Optional but good for CRM)
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price numeric default 0,
  stock integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) - Basic Policy for now: Allow public read/write for demo simplicity
-- In production, strict policies should be applied
alter table customers enable row level security;
alter table invoices enable row level security;
alter table payments enable row level security;
alter table users enable row level security;
alter table products enable row level security;

create policy "Enable all access for now" on customers for all using (true) with check (true);
create policy "Enable all access for now" on invoices for all using (true) with check (true);
create policy "Enable all access for now" on payments for all using (true) with check (true);
create policy "Enable all access for now" on users for all using (true) with check (true);
create policy "Enable all access for now" on products for all using (true) with check (true);
