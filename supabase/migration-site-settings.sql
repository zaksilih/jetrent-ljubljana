-- ============================================================
-- Jet4You — Site Settings table (booking rules, etc.)
-- Run in Supabase SQL Editor AFTER previous migrations
-- ============================================================

create table site_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- RLS
alter table site_settings enable row level security;

-- Public can read settings (needed for calendar validation)
create policy "Public can view site settings"
  on site_settings for select using (true);

-- Updates only via service role (admin API routes)

-- ── Seed: Default booking rules ──────────────────────────────

insert into site_settings (key, value) values (
  'booking_rules',
  '{
    "enforceWeekly": true,
    "requiredStartDay": 6,
    "allowedWeekMultiples": [1, 2, 3],
    "weekendEnabled": true,
    "weekendStartDays": [5, 6],
    "weekendDurations": [2, 3],
    "singleDayEnabled": false
  }'::jsonb
);
