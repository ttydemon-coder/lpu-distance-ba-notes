-- ==============================================================================
-- LPU Distance B.A. Notes Portal - Supabase Database Schema
-- Paste and run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create the 'notes' table
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null,
  subject_code text not null,
  semester integer not null check (semester >= 1 and semester <= 6),
  category text not null default 'Study Notes',
  unit text,
  author text default 'LPU Student Contributor',
  pages integer default 1,
  file_size text default '1.5 MB',
  download_count integer default 0,
  description text,
  pdf_url text not null,
  tags jsonb default '[]'::jsonb,
  is_verified boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Indexes for instant searching and filtering
create index if not exists idx_notes_semester on public.notes (semester);
create index if not exists idx_notes_subject on public.notes (subject);
create index if not exists idx_notes_subject_code on public.notes (subject_code);
create index if not exists idx_notes_created_at on public.notes (created_at desc);

-- 3. Enable Row Level Security (RLS)
alter table public.notes enable row level security;

-- 4. Policies for public reading and uploading
create policy "Allow public read access"
  on public.notes
  for select
  using (true);

create policy "Allow public insert notes"
  on public.notes
  for insert
  with check (true);

create policy "Allow update download count"
  on public.notes
  for update
  using (true);

-- 5. Atomic RPC function to increment download counter
create or replace function increment_download_count(note_id uuid)
returns void as $$
begin
  update public.notes
  set download_count = download_count + 1
  where id = note_id;
end;
$$ language plpgsql security definer;
