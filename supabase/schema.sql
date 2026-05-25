-- Run this in Supabase SQL Editor once for the project.
-- Idempotent: safe to re-run.

-- ============ profiles ==================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  student_id text,
  name text not null,
  department text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select using (true);

drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own"
  on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create a profile row on signup using the user's metadata.name (or email prefix).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ submissions ===============================================
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  service_url text not null,
  description text not null,
  category text,
  tech_stack text[] default '{}',
  thumbnail_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists submissions_created_at_idx
  on public.submissions (created_at desc);

create index if not exists submissions_user_id_idx
  on public.submissions (user_id);

alter table public.submissions enable row level security;

drop policy if exists "submissions_select_all" on public.submissions;
create policy "submissions_select_all"
  on public.submissions for select using (true);

drop policy if exists "submissions_insert_own" on public.submissions;
create policy "submissions_insert_own"
  on public.submissions for insert with check (auth.uid() = user_id);

drop policy if exists "submissions_update_own" on public.submissions;
create policy "submissions_update_own"
  on public.submissions for update using (auth.uid() = user_id);

drop policy if exists "submissions_delete_own" on public.submissions;
create policy "submissions_delete_own"
  on public.submissions for delete using (auth.uid() = user_id);

-- Keep updated_at fresh on writes.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists submissions_touch_updated_at on public.submissions;
create trigger submissions_touch_updated_at
  before update on public.submissions
  for each row execute function public.touch_updated_at();

-- ============ Storage bucket for thumbnails =============================
-- Create the bucket only if it doesn't exist. Make it PUBLIC so card images
-- are readable without signed URLs.
insert into storage.buckets (id, name, public)
values ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

-- Anyone can view thumbnails (bucket is public, but RLS still applies to API).
drop policy if exists "thumbnails_public_read" on storage.objects;
create policy "thumbnails_public_read"
  on storage.objects for select
  using (bucket_id = 'thumbnails');

-- Authenticated users can upload into a folder named after their user id.
-- Path convention: thumbnails/<auth.uid()>/<filename>
drop policy if exists "thumbnails_user_insert" on storage.objects;
create policy "thumbnails_user_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'thumbnails'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "thumbnails_user_update" on storage.objects;
create policy "thumbnails_user_update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'thumbnails'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "thumbnails_user_delete" on storage.objects;
create policy "thumbnails_user_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'thumbnails'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
