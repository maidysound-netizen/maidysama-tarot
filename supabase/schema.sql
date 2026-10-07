create table if not exists public.reading_orders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  product_name text not null,
  question text not null,
  status text not null default 'payment_pending' check (status in ('payment_pending','paid','reading','published','cancelled','refunded')),
  reading_result text,
  created_at timestamptz not null default now(),
  published_at timestamptz
);

alter table public.reading_orders enable row level security;

create policy "owners can read own readings" on public.reading_orders for select using (auth.uid() = owner_id);
create policy "owners can create own readings" on public.reading_orders for insert with check (auth.uid() = owner_id);

create index if not exists reading_orders_owner_id_idx on public.reading_orders(owner_id);
