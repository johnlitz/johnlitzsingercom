-- Guest Book table for johnlitzsinger.com
-- Run this in your Supabase SQL Editor

create table if not exists guestbook (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) <= 100),
  message text not null check (char_length(message) <= 500),
  signature text,          -- base64 PNG data URL from canvas
  image text,              -- base64 JPEG data URL (compressed)
  note_color text,         -- OKLCH color string for sticky note background
  pin_color text,          -- OKLCH color string for thumbtack
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Index for approved entries (the only public query)
create index if not exists idx_guestbook_approved_created
  on guestbook (approved, created_at desc)
  where approved = true;

-- Row Level Security
alter table guestbook enable row level security;

-- Public can read approved entries only
create policy "Public can read approved entries"
  on guestbook for select
  using (approved = true);

-- Public can insert new entries (they start as unapproved)
create policy "Public can insert entries"
  on guestbook for insert
  with check (approved = false);

-- Only authenticated users (owner) can update approval status
-- Use the Supabase dashboard to approve/reject entries
create policy "Authenticated users can update"
  on guestbook for update
  using (auth.role() = 'authenticated');
