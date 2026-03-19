-- ============================================================
-- Jet4You Booking System — Pricing Rules Migration
-- Run this AFTER the main migration.sql
-- Supabase SQL Editor (Dashboard → SQL → New Query)
-- ============================================================

-- ── ENUM ─────────────────────────────────────────────────────

create type pricing_rule_type as enum (
  'low_season',
  'high_season',
  'weekend',
  'daily',
  'custom'
);

-- ── TABLE ────────────────────────────────────────────────────

create table pricing_rules (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  rule_type     pricing_rule_type not null,
  start_date    date not null,
  end_date      date not null,
  price_per_day numeric(10,2) not null,
  priority      integer not null default 0,   -- higher = takes precedence
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint valid_rule_dates check (end_date >= start_date),
  constraint positive_price  check (price_per_day > 0)
);

-- ── INDEXES ──────────────────────────────────────────────────

create index idx_pricing_rules_dates on pricing_rules(start_date, end_date)
  where is_active = true;

create index idx_pricing_rules_type on pricing_rules(rule_type);

-- ── AUTO-UPDATE updated_at ───────────────────────────────────

create trigger trg_pricing_rules_updated
  before update on pricing_rules
  for each row execute function update_updated_at();

-- ── RLS ──────────────────────────────────────────────────────

alter table pricing_rules enable row level security;

-- Public can read active rules (for frontend pricing display)
create policy "Public can view active pricing rules"
  on pricing_rules for select using (is_active = true);

-- Inserts/updates/deletes only via service role (admin API routes)

-- ── SEED: Default 2026 pricing rules ────────────────────────

insert into pricing_rules (name, rule_type, start_date, end_date, price_per_day, priority) values
  ('Nizka sezona – pomlad 2026',  'low_season',  '2026-05-01', '2026-06-24',  60, 10),
  ('Visoka sezona 2026',          'high_season', '2026-06-25', '2026-08-20',  80, 10),
  ('Nizka sezona – jesen 2026',   'low_season',  '2026-08-21', '2026-09-30',  60, 10),
  ('Kratkoročni / zunaj sezone',  'daily',       '2026-01-01', '2026-12-31', 100,  1);
