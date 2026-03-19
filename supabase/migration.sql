-- ============================================================
-- Jet4You Booking System — Supabase Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL → New Query)
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- ============================================================

create type booking_status as enum (
  'pending_payment',
  'confirmed',
  'cancelled',
  'expired',
  'completed'
);

create type payment_status as enum (
  'pending',
  'received',
  'refunded'
);

create type payment_type as enum (
  'deposit',
  'remaining',
  'full'
);

-- ============================================================
-- TABLES
-- ============================================================

-- Jet skis available for rent
create table jetskis (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text not null default '',
  daily_price_low   numeric(10,2) not null default 60,
  daily_price_high  numeric(10,2) not null default 80,
  daily_price_short numeric(10,2) not null default 100,
  image_url   text not null default '/images/1.jpg',
  specs       jsonb not null default '{}',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Customers who make bookings
create table customers (
  id          uuid primary key default uuid_generate_v4(),
  first_name  text not null,
  last_name   text not null,
  email       text not null,
  phone       text not null,
  country     text not null default 'Slovenija',
  created_at  timestamptz not null default now()
);

-- Bookings
create table bookings (
  id                uuid primary key default uuid_generate_v4(),
  reference         text not null unique,
  jetski_id         uuid not null references jetskis(id),
  customer_id       uuid not null references customers(id),
  start_date        date not null,
  end_date          date not null,
  num_days          integer not null,
  daily_rate        numeric(10,2) not null,
  rental_total      numeric(10,2) not null,
  delivery_km       numeric(10,2) not null default 0,
  delivery_fee      numeric(10,2) not null default 0,
  total_price       numeric(10,2) not null,
  deposit_amount    numeric(10,2) not null,  -- 20% of rental
  security_deposit  numeric(10,2) not null default 500,
  status            booking_status not null default 'pending_payment',
  pickup_location   text,
  customer_message  text,
  admin_notes       text,
  expires_at        timestamptz,  -- auto-expire pending bookings
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint valid_dates check (end_date > start_date),
  constraint positive_days check (num_days > 0)
);

-- Payments
create table payments (
  id               uuid primary key default uuid_generate_v4(),
  booking_id       uuid not null references bookings(id) on delete cascade,
  amount           numeric(10,2) not null,
  payment_type     payment_type not null,
  payment_method   text not null default 'bank_transfer',
  status           payment_status not null default 'pending',
  reference_number text not null,
  notes            text,
  received_at      timestamptz,
  created_at       timestamptz not null default now()
);

-- Manually blocked dates (maintenance, personal use, etc.)
create table blocked_dates (
  id          uuid primary key default uuid_generate_v4(),
  jetski_id   uuid not null references jetskis(id) on delete cascade,
  start_date  date not null,
  end_date    date not null,
  reason      text not null default 'Vzdrževanje',
  created_at  timestamptz not null default now(),

  constraint valid_block_dates check (end_date >= start_date)
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_bookings_jetski_dates on bookings(jetski_id, start_date, end_date);
create index idx_bookings_status on bookings(status);
create index idx_bookings_reference on bookings(reference);
create index idx_bookings_expires on bookings(expires_at) where status = 'pending_payment';
create index idx_blocked_dates_jetski on blocked_dates(jetski_id, start_date, end_date);
create index idx_customers_email on customers(email);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_jetskis_updated
  before update on jetskis
  for each row execute function update_updated_at();

create trigger trg_bookings_updated
  before update on bookings
  for each row execute function update_updated_at();

-- ============================================================
-- GENERATE BOOKING REFERENCE (e.g., J4Y-2026-00042)
-- ============================================================

create sequence booking_ref_seq start 1;

create or replace function generate_booking_reference()
returns trigger as $$
begin
  new.reference = 'J4Y-' || extract(year from now())::text || '-' ||
                  lpad(nextval('booking_ref_seq')::text, 5, '0');
  return new;
end;
$$ language plpgsql;

create trigger trg_booking_reference
  before insert on bookings
  for each row execute function generate_booking_reference();

-- ============================================================
-- PREVENT DOUBLE BOOKING (overlap check)
-- ============================================================

create or replace function check_booking_overlap()
returns trigger as $$
begin
  if exists (
    select 1 from bookings
    where jetski_id = new.jetski_id
      and id != coalesce(new.id, uuid_generate_v4())
      and status in ('pending_payment', 'confirmed')
      and start_date < new.end_date
      and end_date > new.start_date
  ) then
    raise exception 'Dates overlap with an existing booking for this jet ski';
  end if;

  if exists (
    select 1 from blocked_dates
    where jetski_id = new.jetski_id
      and start_date < new.end_date
      and end_date > new.start_date
  ) then
    raise exception 'Dates overlap with blocked/maintenance dates';
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trg_check_overlap
  before insert or update on bookings
  for each row execute function check_booking_overlap();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table jetskis enable row level security;
alter table customers enable row level security;
alter table bookings enable row level security;
alter table payments enable row level security;
alter table blocked_dates enable row level security;

-- Public read for active jet skis
create policy "Public can view active jetskis"
  on jetskis for select using (is_active = true);

-- Public read for bookings (availability check — only date/status fields exposed via API)
create policy "Public can view booking dates"
  on bookings for select using (true);

-- Public read for blocked dates
create policy "Public can view blocked dates"
  on blocked_dates for select using (true);

-- Inserts via service role only (API routes use service key)
-- No public insert/update/delete policies — all mutations go through API

-- ============================================================
-- SEED: Insert the first jet ski
-- ============================================================

insert into jetskis (name, slug, description, daily_price_low, daily_price_high, daily_price_short, image_url, specs)
values (
  'Sea-Doo Spark 2UP 90HP',
  'sea-doo-spark-2up',
  'Kompakten, hiter in izjemno zabaven. Idealen spremljevalec za vaš dopust na morju. Lahek, ekonomičen in enostaven za upravljanje.',
  60,
  80,
  100,
  '/images/1.jpg',
  '{
    "year": 2016,
    "engine": "Rotax 900 ACE",
    "horsepower": 90,
    "fuel_type": "Bencin 95",
    "fuel_capacity_l": 30,
    "weight_kg": 185,
    "length_cm": 287,
    "width_cm": 119,
    "capacity": 2,
    "top_speed_kmh": 80
  }'::jsonb
);

-- ============================================================
-- CRON: Expire pending bookings after 24h
-- Enable pg_cron extension in Supabase Dashboard → Database → Extensions
-- Then run:
--
-- select cron.schedule(
--   'expire-pending-bookings',
--   '*/15 * * * *',  -- every 15 minutes
--   $$
--     update bookings
--     set status = 'expired', updated_at = now()
--     where status = 'pending_payment'
--       and expires_at < now();
--   $$
-- );
-- ============================================================
